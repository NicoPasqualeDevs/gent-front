import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik, FormikHelpers } from "formik";
import * as Yup from "yup";
import { useAppContext } from "@/context";
import { ErrorToast, SuccessToast } from "@/components/Toast";
import { 
  FormLayout, FormHeader, FormContent, FormInputGroup,
  FormTextField, FormSelect, FormActions, FormCancelButton, FormButton,
} from "@/utils/FormsViewUtils";
import useProfile from "@/hooks/apps/accounts/useProfile";
import { ApiKey } from "@/types/UserProfile";
import { MenuItem, Box, IconButton, Typography, Button, Divider, Paper, SelectChangeEvent } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import useAccountsApi from '@/hooks/apps/accounts/useAiModels';
import useApiKeys from '@/hooks/apps/accounts/useApiKeys';
import { CreateApiKeyData, ApiProviderType, LLMProvider, LLMModel } from '@/types/Auth';

// Interfaces
interface ProfileFormValues extends Record<string, string> {
  first_name: string;
  last_name: string;
  email: string;
}

interface ApiKeyFormValues extends CreateApiKeyData {
  model: string;
}

interface ProfileState {
  isLoading: boolean;
  isSubmitting: boolean;
  apiKeys: ApiKey[];
  showNewKeyForm: boolean;
  error: string | null;
  selectedProvider: ApiProviderType;
  llmProviders: LLMProvider[];
  llmModels: LLMModel[];
}

interface FormState {
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
}

const ProfileEdit: React.FC = () => {
  const navigate = useNavigate();
  const { auth, replacePath, setAuth } = useAppContext();
  const { updateProfileDetails } = useProfile();
  const { getApiKeys, createApiKey, deleteApiKey } = useApiKeys();
  const { getAIModels } = useAccountsApi();

  // Estado inicial
  const [state, setState] = useState<ProfileState>({
    isLoading: true,
    isSubmitting: false,
    apiKeys: [],
    showNewKeyForm: false,
    error: null,
    selectedProvider: 'OpenAI',
    llmProviders: [],
    llmModels: []
  });

  const [formState, setFormState] = useState<FormState>({
    isLoading: false,
    isSubmitting: false,
    error: null
  });

  // Validación Schema
  const validationSchema = {
    profile: Yup.object({
      first_name: Yup.string()
        .required("El nombre es requerido")
        .min(2, "El nombre debe tener al menos 2 caracteres"),
      last_name: Yup.string()
        .required("El apellido es requerido")
        .min(2, "El apellido debe tener al menos 2 caracteres"),
      email: Yup.string()
        .email("Email inválido")
        .required("El email es requerido"),
    }),
    apiKey: Yup.object({
      api_name: Yup.string().required("El nombre es requerido"),
      api_type: Yup.string().required("El tipo es requerido"),
      api_key: Yup.string().required("La API key es requerida"),
      model: Yup.string().required("El modelo es requerido")
    })
  };

  // Cargar datos iniciales
  useEffect(() => {
    let isMounted = true;

    const loadInitialData = async () => {
      if (!auth?.token) return;
      
      try {
        const [apiKeysResponse, aiModelsResponse] = await Promise.all([
          getApiKeys(),
          getAIModels()
        ]);

        if (!isMounted) return;

        const { providers = [], models = [] } = aiModelsResponse.data;
        const apiKeys = Array.isArray(apiKeysResponse.data) ? apiKeysResponse.data : [];
        
        setState(prev => ({ 
          ...prev, 
          apiKeys: apiKeys as ApiKey[],
          showNewKeyForm: apiKeys.length === 0,
          llmProviders: providers,
          llmModels: models,
          selectedProvider: providers[0]?.value || 'OpenAI',
          isLoading: false
        }));

      } catch (error) {
        if (!isMounted) return;
        console.error(error);
        setState(prev => ({ 
          ...prev, 
          error: "Error al cargar los datos",
          isLoading: false 
        }));
        ErrorToast("Error al cargar los datos del servidor");
      }
    };

    loadInitialData();
    return () => { isMounted = false; };
  }, [auth?.token]);

  // Configurar breadcrumbs
  useEffect(() => {
    replacePath([
      { label: "Perfil", current_path: "/profile", preview_path: "/profile", translationKey: "profile" },
      { label: "Editar", current_path: "/profile/edit", preview_path: "", translationKey: "edit" }
    ]);
  }, [replacePath]);

  // Handlers
  const handleDeleteApiKey = useCallback(async (id: number) => {
    try {
      const response = await deleteApiKey(id);
      if (response.success) {
        setState(prev => ({
          ...prev,
          apiKeys: prev.apiKeys.filter(key => key.id !== id)
        }));
        SuccessToast("API Key eliminada correctamente");
      }
    } catch {
      ErrorToast("Error al eliminar la API key");
    }
  }, [deleteApiKey]);

  const handleApiKeyCreation = useCallback(async (
    values: ApiKeyFormValues,
    { resetForm, setSubmitting }: FormikHelpers<ApiKeyFormValues>
  ) => {
    setFormState(prev => ({ ...prev, isSubmitting: true }));
    
    try {
      const response = await createApiKey(values);
      if (response?.success) {
        setState(prev => ({
          ...prev,
          apiKeys: [...prev.apiKeys, response.data],
          showNewKeyForm: false
        }));
        SuccessToast("API Key creada correctamente");
        resetForm();
      }
    } catch (error) {
      console.error('Error creating API key:', error);
      setFormState(prev => ({
        ...prev,
        error: "Error al crear la API key"
      }));
      ErrorToast("Error al crear la API key");
    } finally {
      setFormState(prev => ({ ...prev, isSubmitting: false }));
      setSubmitting(false);
    }
  }, [createApiKey]);

  // Formik para el perfil
  const profileFormik = useFormik<ProfileFormValues>({
    initialValues: {
      first_name: auth?.first_name || "",
      last_name: auth?.last_name || "",
      email: auth?.email || "",
    },
    validationSchema: validationSchema.profile,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const response = await updateProfileDetails(values);
        if (response?.success && auth) {
          setAuth({ ...auth, ...response.data });
          SuccessToast("Perfil actualizado correctamente");
          navigate("/profile");
        }
      } catch {
        ErrorToast("Error al actualizar el perfil");
      } finally {
        setSubmitting(false);
      }
    },
  });

  // Formik para API Key
  const apiKeyFormik = useFormik<ApiKeyFormValues>({
    initialValues: {
      api_name: "",
      api_type: state.selectedProvider.toLowerCase() as ApiProviderType,
      api_key: "",
      model: ""
    },
    validationSchema: validationSchema.apiKey,
    onSubmit: handleApiKeyCreation
  });

  // Filtrar modelos por proveedor
  const modelsByProvider = useMemo(() => (
    state.llmModels.filter(model => 
      model.provider.toLowerCase() === state.selectedProvider.toLowerCase()
    )
  ), [state.llmModels, state.selectedProvider]);

  // Actualizar el valor cuando se selecciona el proveedor
  const handleProviderChange = (e: SelectChangeEvent<string>) => {
    const newValue = e.target.value as ApiProviderType;
    const apiType = newValue.toLowerCase();
    
    setState(prev => ({ ...prev, selectedProvider: newValue }));
    apiKeyFormik.setFieldValue('api_type', apiType);
    apiKeyFormik.setFieldValue('model', '');
  };

  return (
    <FormLayout>
      <FormHeader title="Editar Perfil" />
      
      <FormContent
        onSubmit={profileFormik.handleSubmit}
        isLoading={state.isLoading}
        isSubmitting={state.isSubmitting}
      >
        {/* Campos del perfil */}
        <FormInputGroup>
          <FormTextField
            name="first_name"
            label="Nombre"
            value={profileFormik.values.first_name}
            onChange={profileFormik.handleChange}
            error={profileFormik.touched.first_name && Boolean(profileFormik.errors.first_name)}
            helperText={profileFormik.touched.first_name ? profileFormik.errors.first_name : undefined}
            required
          />
        </FormInputGroup>

        {/* ... resto de los campos del perfil ... */}

        <Divider sx={{ my: 3 }} />
        
        {/* Sección de API Keys */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6">API Keys</Typography>
          {!state.isLoading && !state.apiKeys.length && (
            <Button
              startIcon={<AddIcon />}
              onClick={() => setState(prev => ({ ...prev, showNewKeyForm: true }))}
              variant="contained"
              color="primary"
            >
              Agregar Primera API Key
            </Button>
          )}
        </Box>

        {/* Lista de API Keys */}
        {state.apiKeys.map((key) => (
          <Paper key={key.id} sx={{ p: 2, mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="subtitle1">{key.api_name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Tipo: {key.api_type}
                </Typography>
              </Box>
              <IconButton 
                onClick={() => handleDeleteApiKey(key.id)}
                color="error"
                size="small"
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          </Paper>
        ))}

        {/* Formulario nueva API Key */}
        {state.showNewKeyForm && (
          <Paper sx={{ p: 2, mb: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>
              {state.apiKeys.length ? 'Nueva API Key' : 'Registra tu primera API Key'}
            </Typography>
            
            <form 
              onSubmit={(e) => {
                e.preventDefault(); // Prevenir el comportamiento por defecto
                apiKeyFormik.handleSubmit();
              }}
            >
              <FormInputGroup>
                <FormTextField
                  name="api_name"
                  label="Nombre"
                  value={apiKeyFormik.values.api_name}
                  onChange={apiKeyFormik.handleChange}
                  error={apiKeyFormik.touched.api_name && Boolean(apiKeyFormik.errors.api_name)}
                  helperText={apiKeyFormik.touched.api_name ? apiKeyFormik.errors.api_name : undefined}
                  required
                />
              </FormInputGroup>

              <FormInputGroup>
                <FormSelect
                  name="api_type"
                  label="Proveedor"
                  value={state.selectedProvider}
                  onChange={handleProviderChange}
                >
                  {state.llmProviders.map((provider) => (
                    <MenuItem key={provider.value} value={provider.value}>
                      {provider.label}
                    </MenuItem>
                  ))}
                </FormSelect>
              </FormInputGroup>

              <FormInputGroup>
                <FormSelect
                  name="model"
                  label="Modelo"
                  value={apiKeyFormik.values.model || ''}
                  onChange={apiKeyFormik.handleChange}
                  error={apiKeyFormik.touched.model && Boolean(apiKeyFormik.errors.model)}
                  helperText={apiKeyFormik.touched.model ? apiKeyFormik.errors.model : undefined}
                >
                  {modelsByProvider.map((model) => (
                    <MenuItem key={model.value} value={model.value}>
                      {model.label}
                    </MenuItem>
                  ))}
                </FormSelect>
              </FormInputGroup>

              <FormInputGroup>
                <FormTextField
                  name="api_key"
                  label="API Key"
                  type="password"
                  value={apiKeyFormik.values.api_key}
                  onChange={apiKeyFormik.handleChange}
                  error={apiKeyFormik.touched.api_key && Boolean(apiKeyFormik.errors.api_key)}
                  helperText={apiKeyFormik.touched.api_key ? apiKeyFormik.errors.api_key : undefined}
                  required
                />
              </FormInputGroup>

              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button 
                  type="submit"
                  variant="contained"
                  disabled={formState.isSubmitting || apiKeyFormik.isSubmitting}
                  onClick={(e) => {
                    e.preventDefault(); // Prevenir el comportamiento por defecto
                    apiKeyFormik.handleSubmit();
                  }}
                >
                  {formState.isSubmitting ? 'Guardando...' : 'Guardar API Key'}
                </Button>
                <Button 
                  onClick={(e) => {
                    e.preventDefault();
                    setState(prev => ({ ...prev, showNewKeyForm: false }));
                  }}
                  variant="outlined"
                >
                  Cancelar
                </Button>
              </Box>
            </form>
          </Paper>
        )}

        {/* Botón para agregar nueva API Key */}
        {!state.showNewKeyForm && state.apiKeys.length > 0 && (
          <Button
            startIcon={<AddIcon />}
            onClick={() => setState(prev => ({ ...prev, showNewKeyForm: true }))}
            variant="contained"
            color="primary"
            sx={{ mb: 2 }}
          >
            Agregar Nueva API Key
          </Button>
        )}

        {/* Acciones del formulario principal */}
        <FormActions>
          <FormCancelButton
            onClick={() => navigate("/profile")}
            disabled={profileFormik.isSubmitting}
          >
            Cancelar
          </FormCancelButton>
          
          <FormButton
            type="submit"
            variant="contained"
            disabled={profileFormik.isSubmitting}
          >
            Guardar Cambios
          </FormButton>
        </FormActions>
      </FormContent>
    </FormLayout>
  );
};

export default React.memo(ProfileEdit);

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAppContext } from "@/context";
import { ErrorToast, SuccessToast } from "@/components/Toast";
import { 
  FormLayout, 
  FormHeader, 
  FormContent, 
  FormInputGroup,
  FormTextField,
  FormSelect,
  FormActions,
  FormCancelButton,
  FormButton,
} from "@/utils/FormsViewUtils";
import useProfile from "@/hooks/apps/accounts/useProfile";
import { ApiKey, ApiKeyFormData } from "@/types/UserProfile";
import { MenuItem, Box, IconButton, Typography, Button, Divider, Paper } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import useAccountsApi from '@/hooks/apps/accounts/useAiModels';
import useApiKeys from '@/hooks/apps/accounts/useApiKeys';

// Interfaces
interface ProfileFormValues extends Record<string, unknown> {
  first_name: string;
  last_name: string;
  email: string;
}

interface ProfileState {
  isLoading: boolean;
  isSubmitting: boolean;
  apiKeys: ApiKey[];
  showNewKeyForm: boolean;
  error: string | null;
  selectedProvider: string;
  llmProviders: LLMProvider[];
  llmModels: LLMModel[];
}

interface LLMProvider {
  value: string;
  label: string;
}

interface LLMModel {
  value: string;
  label: string;
  provider: string;
}

// Interfaces para el formulario de API Key
interface FormHelpers {
  resetForm: () => void;
  setSubmitting: (isSubmitting: boolean) => void;
}

// Función helper para capitalizar la primera letra
const capitalizeFirstLetter = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

const ProfileEdit: React.FC = () => {
  const navigate = useNavigate();
  const { auth, replacePath, setAuth } = useAppContext();
  const { updateProfileDetails } = useProfile();
  const { getApiKeys, createApiKey, deleteApiKey } = useApiKeys();
  const { getAIModels } = useAccountsApi();

  // Estado unificado
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

  // Validación Schema memoizada
  const validationSchema = useMemo(() => 
    Yup.object({
      first_name: Yup.string()
        .required("El nombre es requerido")
        .min(2, "El nombre debe tener al menos 2 caracteres"),
      last_name: Yup.string()
        .required("El apellido es requerido")
        .min(2, "El apellido debe tener al menos 2 caracteres"),
      email: Yup.string()
        .email("Email inválido")
        .required("El email es requerido"),
    }), []);

  // Cargar datos iniciales
  useEffect(() => {
    let isMounted = true;

    const loadInitialData = async () => {
      if (!auth?.token) return;
      
      setState(prev => ({ ...prev, isLoading: true }));
      
      try {
        // Cargar API Keys
        const apiKeysResponse = await getApiKeys();
        const apiKeys = apiKeysResponse?.data || [];
        
        // Cargar modelos de IA
        const aiModelsResponse = await getAIModels();
        const providers = aiModelsResponse.data 
          ? Array.from(new Set(aiModelsResponse.data.map(model => model.provider)))
              .map(provider => ({
                value: provider,
                label: provider
              }))
          : [];
        
        if (isMounted) {
          setState(prev => ({ 
            ...prev, 
            apiKeys,
            showNewKeyForm: apiKeys.length === 0,
            llmProviders: providers,
            llmModels: aiModelsResponse.data || [],
            isLoading: false,
            error: null
          }));
        }
      } catch (error) {
        if (isMounted) {
          setState(prev => ({ 
            ...prev, 
            error: "Error al cargar los datos",
            isLoading: false 
          }));
          ErrorToast("Error al cargar los datos");
        }
      }
    };

    loadInitialData();

    return () => {
      isMounted = false;
    };
  }, [auth?.token]); // Solo depende del token de autenticación

  // Configurar breadcrumbs
  useEffect(() => {
    replacePath([
      { label: "Perfil", current_path: "/profile", preview_path: "/profile", translationKey: "profile" },
      { label: "Editar", current_path: "/profile/edit", preview_path: "", translationKey: "edit" }
    ]);
  }, [replacePath]);

  // Manejadores
  const handleDeleteApiKey = useCallback(async (id: number) => {
    try {
      await deleteApiKey(id);
      setState(prev => ({
        ...prev,
        apiKeys: prev.apiKeys.filter(key => key.id !== id)
      }));
      SuccessToast("API Key eliminada correctamente");
    } catch (error) {
      ErrorToast("Error al eliminar la API key");
    }
  }, [deleteApiKey]);

  const handleToggleNewKeyForm = useCallback(() => {
    setState(prev => ({ ...prev, showNewKeyForm: !prev.showNewKeyForm }));
  }, []);

  const handleApiKeyCreation = useCallback(async (
    values: ApiKeyFormData, 
    { resetForm, setSubmitting }: FormHelpers
  ) => {
    setSubmitting(true);
    try {
      const response = await createApiKey(values);
      if (response?.data) {
        setState(prev => ({
          ...prev,
          apiKeys: [...prev.apiKeys, response.data],
          showNewKeyForm: false // Cerrar el formulario después de crear
        }));
        
        SuccessToast("API Key creada correctamente");
        resetForm();
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error al crear la API key";
      ErrorToast(errorMessage);
    } finally {
      setSubmitting(false);
    }
  }, [createApiKey]);

  // Formik para el perfil principal
  const formik = useFormik<ProfileFormValues>({
    initialValues: {
      first_name: auth?.first_name || "",
      last_name: auth?.last_name || "",
      email: auth?.email || "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setState(prev => ({ ...prev, isSubmitting: true }));
      try {
        const response = await updateProfileDetails(values);
        if (response?.data && auth) {
          setAuth({
            ...auth,
            ...response.data
          });
          SuccessToast("Perfil actualizado correctamente");
          navigate("/profile");
        }
      } catch (error) {
        ErrorToast("Error al actualizar el perfil");
      } finally {
        setState(prev => ({ ...prev, isSubmitting: false }));
      }
    },
  });

  // Formik para API Key
  const apiKeyFormik = useFormik<ApiKeyFormData>({
    initialValues: {
      api_name: "",
      api_type: "openai",
      api_key: "",
      model: ""
    },
    validationSchema: Yup.object({
      api_name: Yup.string().required("El nombre es requerido"),
      api_type: Yup.string().required("El tipo es requerido"),
      api_key: Yup.string().required("La API key es requerida"),
      model: Yup.string().required("El modelo es requerido")
    }),
    onSubmit: handleApiKeyCreation
  });

  // Filtrar modelos por proveedor
  const modelsByProvider = useMemo(() => {
    return state.llmModels.filter(model => 
      model.provider.toLowerCase() === state.selectedProvider.toLowerCase()
    );
  }, [state.llmModels, state.selectedProvider]);

  // Helper para mensajes de error
  const getFieldHelperText = useCallback((fieldName: keyof ProfileFormValues): string | undefined => {
    return formik.touched[fieldName] && formik.errors[fieldName] 
      ? String(formik.errors[fieldName]) 
      : undefined;
  }, [formik.touched, formik.errors]);

  return (
    <FormLayout>
      <FormHeader title="Editar Perfil" />
      
      <FormContent
        onSubmit={formik.handleSubmit}
        isLoading={state.isLoading}
        isSubmitting={state.isSubmitting}
      >
        <FormInputGroup>
          <FormTextField
            name="first_name"
            label="Nombre"
            value={formik.values.first_name}
            onChange={formik.handleChange}
            error={formik.touched.first_name && Boolean(formik.errors.first_name)}
            helperText={getFieldHelperText('first_name')}
            required
          />
        </FormInputGroup>

        <FormInputGroup>
          <FormTextField
            name="last_name"
            label="Apellido"
            value={formik.values.last_name}
            onChange={formik.handleChange}
            error={formik.touched.last_name && Boolean(formik.errors.last_name)}
            helperText={getFieldHelperText('last_name')}
            required
          />
        </FormInputGroup>

        <FormInputGroup>
          <FormTextField
            name="email"
            label="Email"
            value={formik.values.email}
            onChange={formik.handleChange}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={getFieldHelperText('email')}
            required
          />
        </FormInputGroup>

        <Divider sx={{ my: 3 }} />
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">API Keys</Typography>
          {state.apiKeys.length === 0 && !state.showNewKeyForm && (
            <Typography variant="body2" color="text.secondary">
              No hay API keys registradas
            </Typography>
          )}
        </Box>

        {/* Lista de API Keys existentes */}
        {state.apiKeys.length > 0 && (
          <Box sx={{ mb: 3 }}>
            {state.apiKeys.map((key) => (
              <Box 
                key={key.id} 
                sx={{ 
                  mb: 2, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  p: 2,
                  bgcolor: 'background.paper',
                  borderRadius: 1,
                  boxShadow: 1
                }}
              >
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
            ))}
          </Box>
        )}

        {/* Formulario para nueva API Key */}
        {state.showNewKeyForm && (
          <Paper sx={{ p: 2, mb: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>
              {state.apiKeys.length === 0 ? 'Registra tu primera API Key' : 'Nueva API Key'}
            </Typography>
            <Box>
              <FormInputGroup>
                <FormTextField
                  name="api_name"
                  label="Nombre de la API Key"
                  value={apiKeyFormik.values.api_name}
                  onChange={apiKeyFormik.handleChange}
                  error={apiKeyFormik.touched.api_name && Boolean(apiKeyFormik.errors.api_name)}
                  helperText={apiKeyFormik.touched.api_name ? String(apiKeyFormik.errors.api_name) : undefined}
                />
              </FormInputGroup>

              <FormInputGroup>
                <FormSelect
                  name="api_type"
                  label="Proveedor"
                  value={apiKeyFormik.values.api_type}
                  onChange={(e) => {
                    apiKeyFormik.handleChange(e);
                    setState(prev => ({
                      ...prev,
                      selectedProvider: e.target.value
                    }));
                    apiKeyFormik.setFieldValue('model', '');
                  }}
                >
                  {state.llmProviders.map((provider) => (
                    <MenuItem 
                      key={provider.value} 
                      value={provider.value}
                    >
                      {capitalizeFirstLetter(provider.label)}
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
                  helperText={apiKeyFormik.touched.model ? String(apiKeyFormik.errors.model) : undefined}
                >
                  {modelsByProvider.map((model) => (
                    <MenuItem 
                      key={model.value} 
                      value={model.value}
                    >
                      {capitalizeFirstLetter(model.label)}
                    </MenuItem>
                  ))}
                </FormSelect>
              </FormInputGroup>

              <FormInputGroup>
                <FormTextField
                  name="api_key"
                  label="API Key"
                  value={apiKeyFormik.values.api_key}
                  onChange={apiKeyFormik.handleChange}
                  error={apiKeyFormik.touched.api_key && Boolean(apiKeyFormik.errors.api_key)}
                  helperText={apiKeyFormik.touched.api_key ? String(apiKeyFormik.errors.api_key) : undefined}
                  type="password"
                />
              </FormInputGroup>

              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <Button 
                  onClick={() => apiKeyFormik.handleSubmit()}
                  variant="contained"
                  disabled={apiKeyFormik.isSubmitting}
                  color="primary"
                >
                  {apiKeyFormik.isSubmitting ? 'Guardando...' : 'Guardar API Key'}
                </Button>
                <Button 
                  onClick={handleToggleNewKeyForm}
                  variant="outlined"
                  color="primary"
                >
                  Cancelar
                </Button>
              </Box>
            </Box>
          </Paper>
        )}

        {!state.showNewKeyForm && state.apiKeys.length > 0 && (
          <Button
            startIcon={<AddIcon />}
            onClick={handleToggleNewKeyForm}
            variant="contained"
            color="primary"
            sx={{ mb: 2 }}
          >
            Agregar Nueva API Key
          </Button>
        )}

        <FormActions>
          <FormCancelButton
            onClick={() => navigate("/profile")}
            disabled={state.isSubmitting}
          >
            Cancelar
          </FormCancelButton>
          
          <FormButton
            type="submit"
            variant="contained"
            disabled={state.isSubmitting}
          >
            Guardar Cambios
          </FormButton>
        </FormActions>
      </FormContent>
    </FormLayout>
  );
};

export default React.memo(ProfileEdit);

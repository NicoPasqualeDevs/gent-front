import React, { useState, useEffect, useMemo } from "react";
import { MenuItem } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { ErrorToast, SuccessToast } from "@/components/Toast";
import useAdmin from "@/hooks/useAdmin";
import * as Yup from "yup";  
import { useFormik } from "formik";
import { useAppContext } from "@/context/app";
import { languages } from "@/utils/Traslations";
import useAiTeams from "@/hooks/useAiTeams";
import { AiTeamsDetails } from "@/types/AiTeams";
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
import { User } from "@/types/AiTeams";

// Definimos la interfaz para los valores del formulario
interface FormValues {
  id: string;
  name: string;
  description: string;
  address: string;
  owner_data: {
    id: string;
    email: string;
    name: string;
  };
}

interface FormState {
  loaded: boolean;
  isSubmitting: boolean;
  error: string | null;
}

const AiTeamsForm: React.FC = () => {
  const navigate = useNavigate();
  const { aiTeamId, aiTeamName } = useParams();
  const { language, auth, replacePath } = useAppContext();
  const { getAiTeamDetails, createAiTeam, updateAiTeam } = useAiTeams();
  const { listNonSuperUsers } = useAdmin();
  const t = languages[language];

  // Verificar autenticación al inicio
  useEffect(() => {
    if (!auth?.token) {
      navigate('/auth/login');
      return;
    }
  }, [auth?.token, navigate]);

  // Definimos el schema de validación
  const validationSchema = useMemo(() => 
    Yup.object({
      name: Yup.string().required(t.actionAllower.fieldRequired),
      description: Yup.string(),
      address: Yup.string(),
      owner_data: Yup.object({
        id: Yup.string().required(t.actionAllower.fieldRequired),
        email: Yup.string().email(),
        name: Yup.string()
      })
    }), [t]);

  // 1. Reducimos los estados al mínimo necesario
  const [formState, setFormState] = useState<FormState>({
    loaded: false,
    isSubmitting: false,
    error: null
  });

  const [nonSuperUsers, setNonSuperUsers] = useState<User[]>([]);

  // 2. Estabilizamos las funciones API
  const apiMethods = useMemo(() => ({
    getAiTeamDetails,
    createAiTeam,
    updateAiTeam,
    listNonSuperUsers
  }), []); // Dependencia vacía porque estas funciones no deberían cambiar

  // 3. Estabilizamos la configuración inicial
  const config = useMemo(() => ({
    auth,
    aiTeamId,
    aiTeamName,
    language
  }), [auth?.uuid, aiTeamId]); // Solo dependemos de los valores que realmente necesitamos

  // 4. Configuración de Formik con valores iniciales estables
  const formik = useFormik<FormValues>({
    initialValues: {
      id: '',
      name: aiTeamName || '',
      description: '',
      address: '',
      owner_data: {
        name: `${auth?.first_name || ''} ${auth?.last_name || ''}`.trim(),
        email: auth?.email || '',
        id: auth?.uuid || ''
      }
    },
    validationSchema,
    onSubmit: async (values) => {
      if (!auth?.token) {
        ErrorToast(t.common.sessionExpired);
        navigate('/auth/login');
        return;
      }

      setFormState(prev => ({ ...prev, isSubmitting: true }));
      try {
        // Formateamos los datos antes de enviar
        const formattedData: AiTeamsDetails = {
          id: values.id,
          name: values.name,
          description: values.description,
          address: values.address,
          owner_data: {
            id: values.owner_data.id,
            email: values.owner_data.email,
            name: values.owner_data.name
          }
        };

        const response = aiTeamId
          ? await apiMethods.updateAiTeam(formattedData, aiTeamId)
          : await apiMethods.createAiTeam(formattedData);

        if (response?.data) {
          SuccessToast(aiTeamId ? t.aiTeamsForm.successUpdate : t.aiTeamsForm.successCreate);
          navigate('/builder');
        }
      } catch (error: unknown) {
        if (error instanceof Error && error.message === t.common.sessionExpired) {
          ErrorToast(t.common.sessionExpired);
          navigate('/auth/login');
        } else {
          console.error('Error submitting form:', error);
          ErrorToast(t.common.errorSavingData);
        }
      } finally {
        setFormState(prev => ({ ...prev, isSubmitting: false }));
      }
    },
    enableReinitialize: false
  });

  // 5. Un solo efecto para la carga inicial de datos
  useEffect(() => {
    let mounted = true;
    
    const loadData = async () => {
      if (!config.auth?.uuid) {
        navigate('/auth/login');
        return;
      }

      try {
        setFormState(prev => ({ ...prev, loaded: false }));

        // Cargamos el usuario actual
        const currentUser: User = {
          id: Number(config.auth.uuid),
          username: config.auth.first_name || '',
          email: config.auth.email || '',
          first_name: config.auth.first_name || '',
          last_name: config.auth.last_name || ''
        };

        // Cargamos datos en paralelo
        const [usersResponse, teamResponse] = await Promise.all([
          config.auth.is_superuser 
            ? apiMethods.listNonSuperUsers()
            : Promise.resolve({ data: [currentUser] }),
          config.aiTeamId 
            ? apiMethods.getAiTeamDetails(config.aiTeamId)
            : Promise.resolve(null)
        ]);

        if (!mounted) return;

        // Actualizamos usuarios
        setNonSuperUsers(
          config.auth.is_superuser 
            ? [currentUser, ...usersResponse.data]
            : [currentUser]
        );

        // Actualizamos datos del equipo si existe
        if (teamResponse?.data) {
          formik.setValues({
            id: teamResponse.data.id || '',
            name: teamResponse.data.name || '',
            description: teamResponse.data.description || '',
            address: teamResponse.data.address || '',
            owner_data: {
              id: teamResponse.data.owner_data?.id || '',
              email: teamResponse.data.owner_data?.email || '',
              name: teamResponse.data.owner_data?.name || ''
            }
          });
        }

        setFormState(prev => ({ ...prev, loaded: true }));
      } catch (error) {
        if (mounted) {
          console.error('Error loading data:', error);
          setFormState(prev => ({
            ...prev,
            loaded: true,
            error: t.common.errorLoadingData
          }));
        }
      }
    };

    loadData();

    return () => {
      mounted = false;
    };
  }, [config.auth?.uuid, config.aiTeamId]); // Solo las dependencias esenciales

  // 6. Efecto separado para el pathbar
  useEffect(() => {
    replacePath([
      {
        label: t.leftMenu.aiTeams,
        current_path: "/builder",
        preview_path: "/builder",
        translationKey: "aiTeams"
      },
      {
        label: config.aiTeamId ? t.aiTeamsForm.editTitle : t.aiTeamsForm.createTitle,
        current_path: config.aiTeamId ? `/builder/form/${config.aiTeamName}/${config.aiTeamId}` : "/builder/form",
        preview_path: "",
        translationKey: config.aiTeamId ? "editTeam" : "createTeam"
      }
    ]);
  }, [config.aiTeamId, config.aiTeamName, t.leftMenu.aiTeams, t.aiTeamsForm.editTitle, t.aiTeamsForm.createTitle]);

  // Componente de error memoizado
  const ErrorMessage = useMemo(() => {
    if (!formState.error) return null;
    return (
      <FormInputGroup>
        <div className="error-message">
          {formState.error}
        </div>
      </FormInputGroup>
    );
  }, [formState.error]);

  // Memoizamos la lista de usuarios para el select
  const userOptions = useMemo(() => 
    nonSuperUsers.map((user) => (
      <MenuItem key={user.id} value={user.id.toString()}>
        {`${user.first_name} ${user.last_name} (${user.email})`}
        {user.id === Number(auth?.uuid) && ` (${t.aiTeamsForm.currentUser})`}
      </MenuItem>
    )), [nonSuperUsers, auth?.uuid, t]);

  // Memoizamos el título del formulario
  const formTitle = useMemo(() => 
    aiTeamId 
      ? t.aiTeamsForm.editTitle.replace('{teamName}', formik.values.name || aiTeamName || '')
      : t.aiTeamsForm.createTitle,
    [aiTeamId, formik.values.name, aiTeamName, t]
  );

  // Memoizamos los botones de acción
  const ActionButtons = useMemo(() => (
    <FormActions>
      <FormCancelButton
        onClick={() => navigate(-1)}
        disabled={!formState.loaded || formState.isSubmitting}
      >
        {t.aiTeamsForm.cancel}
      </FormCancelButton>
      
      <FormButton
        type="submit"
        variant="contained"
        disabled={!formState.loaded || formState.isSubmitting}
      >
        {aiTeamId ? t.aiTeamsForm.update : t.aiTeamsForm.create}
      </FormButton>
    </FormActions>
  ), [formState.loaded, formState.isSubmitting, aiTeamId, navigate, t]);

  // Verificación de estado de carga
  if (!auth?.uuid) return null;

  return (
    <FormLayout>
      <FormHeader title={formTitle} />

      <FormContent
        onSubmit={formik.handleSubmit}
        isLoading={!formState.loaded}
        isSubmitting={formState.isSubmitting}
      >
        {formState.error && ErrorMessage}
        
        {formState.loaded && (
          <>
            <FormInputGroup>
              <FormTextField
                name="name"
                label={t.aiTeamsForm.teamName}
                value={formik.values.name}
                onChange={formik.handleChange}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={(formik.touched.name && formik.errors.name) || undefined}
                required
                disabled={formState.isSubmitting}
              />
            </FormInputGroup>
            <FormInputGroup>
              <FormTextField
                name="description"
                label={t.aiTeamsForm.description}
                value={formik.values.description}
                onChange={formik.handleChange}
                error={formik.touched.description && Boolean(formik.errors.description)}
                helperText={(formik.touched.description && formik.errors.description) || undefined}
                multiline
                rows={4}
                disabled={formState.isSubmitting}
              />
            </FormInputGroup>

            <FormInputGroup>
              <FormTextField
                name="address"
                label={t.aiTeamsForm.address}
                value={formik.values.address}
                onChange={formik.handleChange}
                error={formik.touched.address && Boolean(formik.errors.address)}
                helperText={(formik.touched.address && formik.errors.address) || undefined}
                disabled={formState.isSubmitting}
              />
            </FormInputGroup>

            <FormInputGroup>
              <FormSelect
                name="owner_data.id"
                label={t.aiTeamsForm.selectUser}
                value={formik.values.owner_data.id}
                onChange={formik.handleChange}
                error={
                  formik.touched.owner_data?.id && 
                  Boolean(formik.errors.owner_data?.id)
                }
                helperText={
                  (formik.touched.owner_data?.id && 
                  formik.errors.owner_data?.id as string) || undefined
                }
                disabled={formState.isSubmitting}
              >
                {userOptions}
              </FormSelect>
            </FormInputGroup>

            {ActionButtons}
          </>
        )}
      </FormContent>
    </FormLayout>
  );
};

export default React.memo(AiTeamsForm);

import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppContext } from "@/context";
import { AgentFormData } from "@/types/Agents";
import { ErrorToast, SuccessToast } from "@/components/Toast";
import { languages } from "@/utils/Traslations";
import useAgentsApi from "@/hooks/apps/agents";
import { MenuItem } from "@mui/material";
import * as Yup from "yup";
import { useFormik } from "formik";
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
import { ApiKey } from "@/types/UserProfile";

interface FormValues extends Record<string, string> {
  name: string;
  description: string;
  selected_api_key: string;
}

interface FormState {
  loaded: boolean;
  isSubmitting: boolean;
  error: string | null;
}

const AgentForm: React.FC = () => {
  const navigate = useNavigate();
  const { aiTeamId, agentId } = useParams();
  const { auth, language, replacePath } = useAppContext();
  const { getAgentDetails, createAgent, updateAgent } = useAgentsApi();
  const t = languages[language as keyof typeof languages];
  const { getApiKeys } = useProfile();
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);

  const [formState, setFormState] = useState<FormState>({
    loaded: false,
    isSubmitting: false,
    error: null
  });

  const validationSchema = useMemo(() => 
    Yup.object({
      name: Yup.string().required(t.contextEntry.fieldRequired),
      description: Yup.string(),
      selected_api_key: Yup.string().required(t.contextEntry.fieldRequired)
    }), [t]);

  const formik = useFormik<FormValues>({
    initialValues: {
      name: '',
      description: '',
      selected_api_key: ''
    },
    validationSchema,
    onSubmit: async (values) => {
      if (!auth?.token) {
        ErrorToast(t.common.sessionExpired);
        navigate('/auth/login');
        return;
      }

      if (!aiTeamId) {
        ErrorToast(t.contextEntry.errorMissingTeamId);
        return;
      }

      setFormState(prev => ({ ...prev, isSubmitting: true }));

      try {
        const selectedApiKey = apiKeys.find(key => key.id.toString() === values.selected_api_key);
        
        const formData: AgentFormData = {
          name: values.name,
          description: values.description,
          selected_api_key: values.selected_api_key,
          model_ai: selectedApiKey?.api_name || '',
          team: aiTeamId
        };

        const response = agentId
          ? await updateAgent(formData, agentId)
          : await createAgent(formData, aiTeamId);

        if (response?.data) {
          SuccessToast(agentId ? t.contextEntry.successUpdate : t.contextEntry.successCreate);
          navigate(`/builder/agents/${response.data.name}/${aiTeamId}`);
        }
      } catch (error) {
        console.error('Error submitting form:', error);
        ErrorToast(error instanceof Error ? error.message : t.contextEntry.errorConnection);
      } finally {
        setFormState(prev => ({ ...prev, isSubmitting: false }));
      }
    },
    enableReinitialize: true
  });

  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      if (!auth?.uuid) {
        navigate('/auth/login');
        return;
      }

      try {
        setFormState(prev => ({ ...prev, loaded: false }));

        if (agentId) {
          const response = await getAgentDetails(agentId);
          
          if (!mounted) return;

          if (response?.data) {
            formik.setValues({
              name: response.data.name,
              description: response.data.description || '',
              selected_api_key: (response.data.selected_api_key || '').toString()
            });
          }
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
          ErrorToast(t.common.errorLoadingData);
        }
      }
    };

    loadData();

    return () => {
      mounted = false;
    };
  }, [auth?.uuid, agentId]);

  useEffect(() => {
    replacePath([
      {
        label: t.leftMenu.teams,
        current_path: "/builder",
        preview_path: "/builder",
        translationKey: 'teams'
      },
      {
        label: agentId ? t.contextEntry.editTitle : t.contextEntry.createTitle,
        current_path: `/builder/agents/contextEntry/${aiTeamId}`,
        preview_path: "",
        translationKey: agentId ? 'editTitle' : 'createTitle'
      },
    ]);
  }, [agentId, aiTeamId, replacePath, t]);

  useEffect(() => {
    const loadApiKeys = async () => {
      try {
        const response = await getApiKeys();
        if (response?.data) {
          setApiKeys(response.data);
        }
      } catch (error) {
        console.error('Error loading API keys:', error);
        ErrorToast(t.common.errorLoadingData);
      }
    };

    loadApiKeys();
  }, []);

  return (
    <FormLayout>
      <FormHeader 
        title={agentId ? t.contextEntry.editTitle : t.contextEntry.createTitle} 
      />

      <FormContent
        onSubmit={formik.handleSubmit}
        isLoading={!formState.loaded}
        isSubmitting={formState.isSubmitting}
      >
        <FormInputGroup>
          <FormTextField
            name="name"
            label={t.contextEntry.name}
            value={formik.values.name}
            onChange={formik.handleChange}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name ? formik.errors.name : undefined}
            required
            disabled={formState.isSubmitting}
          />
        </FormInputGroup>

        <FormInputGroup>
          <FormTextField
            name="description"
            label={t.contextEntry.description}
            value={formik.values.description}
            onChange={formik.handleChange}
            error={formik.touched.description && Boolean(formik.errors.description)}
            helperText={formik.touched.description ? formik.errors.description : undefined}
            multiline
            rows={4}
            disabled={formState.isSubmitting}
          />
        </FormInputGroup>

        <FormInputGroup>
          <FormSelect
            name="selected_api_key"
            label={t.common.apiKey}
            value={formik.values.selected_api_key}
            onChange={formik.handleChange}
            error={formik.touched.selected_api_key && Boolean(formik.errors.selected_api_key)}
            helperText={formik.touched.selected_api_key ? formik.errors.selected_api_key : undefined}
            disabled={formState.isSubmitting}
          >
            <MenuItem value="">
              <em>{t.common.select}</em>
            </MenuItem>
            {apiKeys.map((apiKey) => (
              <MenuItem key={apiKey.id} value={apiKey.id}>
                {apiKey.api_name} - {apiKey.api_type}
              </MenuItem>
            ))}
          </FormSelect>
        </FormInputGroup>

        <FormActions>
          <FormCancelButton
            onClick={() => navigate(-1)}
            disabled={formState.isSubmitting}
          >
            {t.contextEntry.cancel}
          </FormCancelButton>
          
          <FormButton
            type="submit"
            variant="contained"
            disabled={formState.isSubmitting}
            loading={formState.isSubmitting}
          >
            {agentId ? t.contextEntry.update : t.contextEntry.create}
          </FormButton>
        </FormActions>
      </FormContent>
    </FormLayout>
  );
};

export default React.memo(AgentForm);
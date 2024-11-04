import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppContext } from "@/context/app";
import { BotFormData } from "@/types/Bots";
import { ErrorToast, SuccessToast } from "@/components/Toast";
import { languages } from "@/utils/Traslations";
import useBotsApi from "@/hooks/useBots";
import { MenuItem } from "@mui/material";
import { modelAIOptions } from "@/utils/LargeModelsUtils";
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

interface FormValues extends Record<string, string> {
  name: string;
  description: string;
  model_ai: string;
}

interface FormState {
  loaded: boolean;
  isSubmitting: boolean;
  error: string | null;
}

const ContextEntry: React.FC = () => {
  const navigate = useNavigate();
  const { aiTeamId, botId } = useParams();
  const { auth, language, replacePath } = useAppContext();
  const { getBotDetails, createBot, updateBot } = useBotsApi();
  const t = languages[language as keyof typeof languages];

  const [formState, setFormState] = useState<FormState>({
    loaded: false,
    isSubmitting: false,
    error: null
  });

  const validationSchema = useMemo(() => 
    Yup.object({
      name: Yup.string().required(t.contextEntry.fieldRequired),
      description: Yup.string(),
      model_ai: Yup.string().required(t.contextEntry.fieldRequired)
    }), [t]);

  const formik = useFormik<FormValues>({
    initialValues: {
      name: '',
      description: '',
      model_ai: modelAIOptions[0].value
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
        const formData: BotFormData = {
          name: values.name,
          description: values.description,
          model_ai: values.model_ai
        };

        const response = botId
          ? await updateBot(formData, botId)
          : await createBot(formData, aiTeamId);

        if (response?.data) {
          SuccessToast(botId ? t.contextEntry.successUpdate : t.contextEntry.successCreate);
          navigate(`/builder/agents/${response.data.name}/${aiTeamId}`, {
            state: { refreshData: true }
          });
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

        if (botId) {
          const response = await getBotDetails(botId);
          
          if (!mounted) return;

          if (response?.data) {
            formik.setValues({
              name: response.data.name,
              description: response.data.description || '',
              model_ai: response.data.model_ai
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
          ErrorToast(t.contextEntry.errorConnection);
        }
      }
    };

    loadData();

    return () => {
      mounted = false;
    };
  }, [auth?.uuid, botId]);

  useEffect(() => {
    replacePath([
      {
        label: t.leftMenu.aiTeams,
        current_path: "/builder",
        preview_path: "/builder",
        translationKey: 'aiTeams'
      },
      {
        label: botId ? t.contextEntry.editTitle : t.contextEntry.createTitle,
        current_path: `/builder/agents/contextEntry/${aiTeamId}`,
        preview_path: "",
        translationKey: botId ? 'editTitle' : 'createTitle'
      },
    ]);
  }, [botId, aiTeamId, replacePath, t]);

  return (
    <FormLayout>
      <FormHeader 
        title={botId ? t.contextEntry.editTitle : t.contextEntry.createTitle} 
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
            name="model_ai"
            label={t.contextEntry.modelAI}
            value={formik.values.model_ai}
            onChange={formik.handleChange}
            error={formik.touched.model_ai && Boolean(formik.errors.model_ai)}
            helperText={formik.touched.model_ai ? formik.errors.model_ai : undefined}
            disabled={formState.isSubmitting}
          >
            {modelAIOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
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
            {botId ? t.contextEntry.update : t.contextEntry.create}
          </FormButton>
        </FormActions>
      </FormContent>
    </FormLayout>
  );
};

export default React.memo(ContextEntry);
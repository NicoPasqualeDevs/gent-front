import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppContext } from '@/context/app';
import { ErrorToast, SuccessToast } from '@/components/Toast';
import { languages } from "@/utils/Traslations";
import useAiTeamsApi from "@/hooks/useAiTeams";
import { Container, Box, Paper, Button } from '@mui/material';
import { AiTeamsFormState } from '@/types/AiTeams';
import { 
  FormLayout, 
  FormHeader, 
  FormContent, 
  FormInputGroup,
  FormButton,
  FormActions,
  FormCancelButton,
  FormTextField
} from "@/utils/FormsViewUtils";
import { PageProps } from '@/types/Page';

const AiTeamsForm: React.FC<PageProps> = () => {
  const navigate = useNavigate();
  const { aiTeamId, aiTeamName } = useParams();
  const { auth, language, replacePath } = useAppContext();
  const { getAiTeamDetails, createAiTeam, updateAiTeam } = useAiTeamsApi();
  const [state, setState] = useState<AiTeamsFormState>({
    isLoading: true,
    isError: false,
    isSubmitting: false,
    isEditing: Boolean(aiTeamId),
    searchQuery: '',
    contentPerPage: '5',
    isSearching: false,
    formData: {
      name: '',
      description: '',
      address: '',
    }
  });
  const t = languages[language as keyof typeof languages];

  const initializeForm = useCallback(async () => {
    if (!auth?.uuid) {
      console.log('No auth found, redirecting to login');
      navigate('/auth/login');
      return;
    }

    const currentPath = state.isEditing 
      ? `/builder/form/${aiTeamName}/${aiTeamId}`
      : "/builder/form";

    replacePath([
      {
        label: state.isEditing ? state.formData.name || aiTeamName || '' : t.leftMenu.aiTeams,
        current_path: "/builder",
        preview_path: "/builder",
        translationKey: "aiTeams"
      },
      {
        label: state.isEditing ? t.aiTeamsForm.editTitle : t.aiTeamsForm.createTitle,
        current_path: currentPath,
        preview_path: "",
        translationKey: state.isEditing ? "editTeam" : "createTeam"
      },
    ]);

    if (!state.isEditing || !aiTeamId) {
      setState(prev => ({ ...prev, isLoading: false }));
      return;
    }

    try {
      console.log('Fetching team details for:', aiTeamId);
      const teamDetails = await getAiTeamDetails(aiTeamId);
      
      if (teamDetails?.data) {
        setState(prev => ({
          ...prev,
          formData: {
            name: teamDetails.data.name,
            description: teamDetails.data.description || '',
            address: teamDetails.data.address || '',
            owner: teamDetails.data.owner
          },
          isLoading: false
        }));
      }
    } catch (error) {
      console.error('Error initializing form:', error);
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        isError: true,
        errorMessage: error instanceof Error ? error.message : 'Unknown error'
      }));
      ErrorToast(t.actionAllower.fieldRequired);
      navigate('/builder');
    }
  }, [auth?.uuid, aiTeamId, aiTeamName, getAiTeamDetails, navigate, replacePath, t.leftMenu.aiTeams, t.aiTeamsForm.editTitle, t.aiTeamsForm.createTitle, state.formData.name, state.isEditing]);

  useEffect(() => {
    if (state.isLoading) {
      initializeForm();
    }
  }, [aiTeamId]);

  useEffect(() => {
    if (!aiTeamId) {
      setState(prev => ({
        ...prev,
        isEditing: false,
        formData: {
          name: '',
          description: '',
          address: '',
        }
      }));
    }
  }, [aiTeamId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!state.formData.name.trim()) {
      ErrorToast(t.actionAllower.fieldRequired);
      return;
    }

    try {
      setState(prev => ({ ...prev, isSubmitting: true }));

      const response = state.isEditing && aiTeamId
        ? await updateAiTeam(state.formData, aiTeamId)
        : await createAiTeam(state.formData);

      if (response?.data) {
        SuccessToast(state.isEditing ? t.aiTeamsForm.successUpdate : t.aiTeamsForm.successCreate);
        navigate('/builder');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      ErrorToast(t.actionAllower.fieldRequired);
    } finally {
      setState(prev => ({ ...prev, isSubmitting: false }));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setState(prev => ({
      ...prev,
      formData: { ...prev.formData, [name]: value }
    }));
  };

  if (state.isError) {
    return null;
  }

  return (
    <FormLayout>
      <FormHeader 
        title={state.isEditing 
          ? t.aiTeamsForm.editTitle.replace('{teamName}', state.formData.name || aiTeamName || '')
          : t.aiTeamsForm.createTitle}
      />
      
      <FormContent 
        onSubmit={handleSubmit}
        isLoading={state.isLoading}
      >
        {!state.isError && (
          <>
            <FormInputGroup>
              <FormTextField
                name="name"
                label={t.aiTeamsForm.teamName}
                value={state.formData.name}
                onChange={handleInputChange}
                required
              />
            </FormInputGroup>

            <FormInputGroup>
              <FormTextField
                name="description"
                label={t.aiTeamsForm.description}
                value={state.formData.description}
                onChange={handleInputChange}
                multiline
                rows={4}
              />
            </FormInputGroup>

            <FormInputGroup>
              <FormTextField
                name="address"
                label={t.aiTeamsForm.address}
                value={state.formData.address}
                onChange={handleInputChange}
              />
            </FormInputGroup>

            <FormActions>
              <FormCancelButton
                onClick={() => navigate('/builder')}
                disabled={state.isSubmitting}
              >
                {t.aiTeamsForm.cancel}
              </FormCancelButton>
              <FormButton
                type="submit"
                variant="contained"
                disabled={state.isSubmitting}
              >
                {state.isSubmitting 
                  ? t.aiTeamsForm.saving 
                  : state.isEditing 
                    ? t.aiTeamsForm.update 
                    : t.aiTeamsForm.create}
              </FormButton>
            </FormActions>
          </>
        )}
      </FormContent>
    </FormLayout>
  );
};

export default AiTeamsForm;

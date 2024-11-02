import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppContext } from '@/context/app';
import { PageCircularProgress } from '@/components/CircularProgress';
import { PageProps } from '@/types/Page';
import { ErrorToast, SuccessToast } from '@/components/Toast';
import { languages } from "@/utils/Traslations";
import useAiTeamsApi from "@/hooks/useAiTeams";
import { Container, Box, Paper, TextField, Button } from '@mui/material';
import { AiTeamsFormState } from './types';

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
        label: t.leftMenu.aiTeams,
        current_path: "/builder",
        preview_path: "/builder",
      },
      {
        label: state.isEditing ? t.aiTeamsForm.editTitle : t.aiTeamsForm.createTitle,
        current_path: currentPath,
        preview_path: "",
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
  }, [auth?.uuid, aiTeamId, aiTeamName, getAiTeamDetails, navigate, replacePath, t.leftMenu.aiTeams, t.aiTeamsForm.editTitle, t.aiTeamsForm.createTitle]);

  useEffect(() => {
    if (state.isLoading) {
      initializeForm();
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

  if (state.isLoading) {
    return <PageCircularProgress />;
  }

  if (state.isError) {
    return null;
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              name="name"
              label={t.aiTeamsForm.teamName}
              value={state.formData.name}
              onChange={handleInputChange}
              required
              fullWidth
            />
            <TextField
              name="description"
              label={t.aiTeamsForm.description}
              value={state.formData.description}
              onChange={handleInputChange}
              multiline
              rows={4}
              fullWidth
            />
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                onClick={() => navigate('/builder')}
                disabled={state.isSubmitting}
              >
                {t.aiTeamsForm.cancel}
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={state.isSubmitting}
              >
                {state.isSubmitting 
                  ? t.aiTeamsForm.saving 
                  : state.isEditing 
                    ? t.aiTeamsForm.update 
                    : t.aiTeamsForm.create}
              </Button>
            </Box>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default AiTeamsForm;

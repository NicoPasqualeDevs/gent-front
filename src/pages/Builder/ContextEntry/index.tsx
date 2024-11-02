import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppContext } from '@/context/app';
import { PageCircularProgress } from '@/components/CircularProgress';
import { PageProps } from '@/types/Page';
import { ErrorToast, SuccessToast } from '@/components/Toast';
import { languages } from "@/utils/Traslations";
import useBotsApi from "@/hooks/useBots";
import { Container, Box, Paper, TextField, Button, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { ContextEntryState, ContextEntryFormData } from './types';
import { modelAIOptions } from "@/utils/LargeModelsUtils";
import { SelectChangeEvent } from '@mui/material/Select';

const ContextEntry: React.FC<PageProps> = () => {
  const navigate = useNavigate();
  const { aiTeamId, botId } = useParams();
  const { auth, language, replacePath } = useAppContext();
  const { getBotDetails, createBot, updateBot } = useBotsApi();
  const [state, setState] = useState<ContextEntryState>({
    isLoading: true,
    isError: false,
    isSubmitting: false,
    isEditing: Boolean(botId),
    searchQuery: '',
    contentPerPage: '5',
    isSearching: false,
    formData: {
      name: '',
      description: '',
      model_ai: modelAIOptions[0].value
    }
  });
  const t = languages[language as keyof typeof languages];

  useEffect(() => {
    let isSubscribed = true;

    const initializePage = async () => {
      try {
        if (!auth?.user?.uuid) {
          throw new Error('User not authenticated');
        }

        if (!aiTeamId) {
          throw new Error('AI Team ID is required');
        }

        // Configurar navegación
        replacePath([
          {
            label: t.leftMenu.aiTeams,
            current_path: "/builder",
            preview_path: "/builder",
          },
          {
            label: state.isEditing ? t.contextEntry.editTitle : t.contextEntry.createTitle,
            current_path: `/builder/agents/contextEntry/${aiTeamId}`,
            preview_path: "",
          },
        ]);

        // Si estamos editando, cargar datos del bot
        if (state.isEditing && botId) {
          const botDetails = await getBotDetails(botId);
          
          if (!isSubscribed) return;

          if (botDetails?.data) {
            setState(prev => ({
              ...prev,
              formData: {
                name: botDetails.data.name,
                description: botDetails.data.description || '',
                model_ai: botDetails.data.model_ai
              }
            }));
          }
        }

        if (isSubscribed) {
          setState(prev => ({ ...prev, isLoading: false }));
        }
      } catch (error) {
        if (isSubscribed) {
          setState(prev => ({ 
            ...prev, 
            isLoading: false, 
            isError: true,
            errorMessage: error instanceof Error ? error.message : 'Unknown error'
          }));
          ErrorToast(t.actionAllower.fieldRequired);
          navigate('/builder');
        }
      }
    };

    initializePage();

    return () => {
      isSubscribed = false;
    };
  }, [auth?.user?.uuid, aiTeamId, botId, state.isEditing, navigate, replacePath, getBotDetails, t]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setState(prev => ({ ...prev, isSubmitting: true }));

      if (state.isEditing && !botId) {
        throw new Error('Bot ID is required for editing');
      }

      const response = state.isEditing && botId
        ? await updateBot(state.formData, botId)
        : await createBot(state.formData);

      if (response?.data) {
        SuccessToast(state.isEditing ? t.contextEntry.successUpdate : t.contextEntry.successCreate);
        navigate(`/builder/agents/${response.data.name}/${response.data.id}`);
      }
    } catch (error) {
      ErrorToast(t.contextEntry.errorConnection);
    } finally {
      setState(prev => ({ ...prev, isSubmitting: false }));
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>
  ) => {
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
              label={t.contextEntry.name}
              value={state.formData.name}
              onChange={handleInputChange}
              required
              fullWidth
            />
            <TextField
              name="description"
              label={t.contextEntry.description}
              value={state.formData.description}
              onChange={handleInputChange}
              multiline
              rows={4}
              fullWidth
            />
            <FormControl fullWidth required>
              <InputLabel id="model-ai-label">{t.contextEntry.modelAI}</InputLabel>
              <Select
                labelId="model-ai-label"
                name="model_ai"
                value={state.formData.model_ai}
                onChange={handleInputChange}
                label={t.contextEntry.modelAI}
              >
                {modelAIOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                onClick={() => navigate('/builder')}
                disabled={state.isSubmitting}
              >
                {t.contextEntry.cancel}
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={state.isSubmitting}
              >
                {state.isSubmitting 
                  ? t.contextEntry.saving 
                  : state.isEditing 
                    ? t.contextEntry.update 
                    : t.contextEntry.create}
              </Button>
            </Box>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default ContextEntry;
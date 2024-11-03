import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppContext } from '@/context/app';
import { PageProps } from '@/types/Page';
import { ErrorToast, SuccessToast } from '@/components/Toast';
import { languages } from "@/utils/Traslations";
import useBotsApi from "@/hooks/useBots";
import { Container, Box, Paper, TextField, Button, Typography, LinearProgress } from '@mui/material';
import { DataEntryState } from './types';

const MAX_FILE_SIZE = 10; // MB

const DataEntry: React.FC<PageProps> = () => {
  const navigate = useNavigate();
  const { botId } = useParams();
  const { auth, language, replacePath } = useAppContext();
  const { getBotDetails, updateBotData, uploadDocument } = useBotsApi();
  const [state, setState] = useState<DataEntryState>({
    isLoading: true,
    isError: false,
    isSubmitting: false,
    isEditing: Boolean(botId),
    searchQuery: '',
    contentPerPage: '5',
    isSearching: false,
    dragActive: false,
    uploadProgress: 0,
    formData: {
      context: '',
      documents: []
    }
  });
  const t = languages[language as keyof typeof languages];

  useEffect(() => {
    let isSubscribed = true;

    const initializePage = async () => {
      try {
        if (!auth?.uuid) {
          throw new Error('User not authenticated');
        }

        if (!botId) {
          throw new Error('Bot ID is required');
        }

        // Obtener detalles del bot
        const botDetails = await getBotDetails(botId);
        
        if (!isSubscribed) return;

        if (!botDetails?.data) {
          throw new Error('Bot not found');
        }

        // Configurar navegación
        replacePath([
          {
            label: t.leftMenu.aiTeams,
            current_path: "/builder",
            preview_path: "/builder",
            translationKey: 'aiTeams'
          },
          {
            label: botDetails.data.name,
            current_path: `/builder/agents/dataEntry/${botId}`,
            preview_path: "",
            translationKey: 'botDetails'
          },
        ]);

        // Cargar datos existentes si hay
        setState(prev => ({
          ...prev,
          formData: {
            context: botDetails.data.context || '',
            documents: []
          }
        }));

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
  }, [auth?.uuid, botId, navigate, replacePath, getBotDetails, t]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setState(prev => ({ ...prev, isSubmitting: true }));

      if (!botId) {
        throw new Error('Bot ID is required');
      }

      // Primero actualizamos el contexto
      const response = await updateBotData({
        context: state.formData.context,
        documents: []
      }, botId);

      // Si hay archivos, los subimos uno por uno
      if (state.formData.documents.length > 0) {
        for (const file of state.formData.documents) {
          await uploadDocument(file, botId, (progress) => {
            setState(prev => ({ ...prev, uploadProgress: progress }));
          });
        }
      }

      if (response?.data) {
        SuccessToast(t.dataEntry.successUpdate);
        navigate(`/builder/agents/${response.data.name}/${response.data.id}`);
      }
    } catch (error) {
      ErrorToast(t.dataEntry.errorConnection);
    } finally {
      setState(prev => ({ ...prev, isSubmitting: false, uploadProgress: 0 }));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setState(prev => ({
      ...prev,
      formData: { ...prev.formData, [name]: value }
    }));
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setState(prev => ({ ...prev, dragActive: true }));
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setState(prev => ({ ...prev, dragActive: false }));
  };

  const handleFileUpload = async (files: File[]) => {
    if (!botId) return;

    try {
      setState(prev => ({ ...prev, isSubmitting: true }));

      for (const file of files) {
        await uploadDocument(file, botId, (progress) => {
          setState(prev => ({ ...prev, uploadProgress: progress }));
        });
      }

      SuccessToast(t.dataEntry.uploadSuccess);
      setState(prev => ({
        ...prev,
        formData: {
          ...prev.formData,
          documents: []
        },
        uploadProgress: 0
      }));
    } catch (error) {
      ErrorToast(t.dataEntry.uploadError);
      setState(prev => ({ 
        ...prev, 
        uploadError: t.dataEntry.uploadError,
        uploadProgress: 0
      }));
    } finally {
      setState(prev => ({ ...prev, isSubmitting: false }));
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setState(prev => ({ ...prev, dragActive: false }));
    
    if (e.dataTransfer.files && botId) {
      const validFiles = Array.from(e.dataTransfer.files).filter(file => {
        const isValidSize = file.size <= MAX_FILE_SIZE * 1024 * 1024;
        if (!isValidSize) {
          ErrorToast(t.dataEntry.maxSize.replace("{size}", MAX_FILE_SIZE.toString()));
        }
        return isValidSize;
      });

      if (validFiles.length > 0) {
        await handleFileUpload(validFiles);
      }
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              name="context"
              label={t.dataEntry.context}
              value={state.formData.context}
              onChange={handleInputChange}
              multiline
              rows={6}
              fullWidth
              required
            />
            
            <Box
              onDragEnter={handleDragEnter}
              onDragOver={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              sx={{
                border: '2px dashed',
                borderColor: state.dragActive ? 'primary.main' : 'divider',
                borderRadius: 1,
                p: 3,
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'border-color 0.2s',
                '&:hover': {
                  borderColor: 'primary.main',
                },
              }}
            >
              <Typography>{t.dataEntry.dragAndDrop}</Typography>
              <Typography variant="caption" color="text.secondary">
                {t.dataEntry.maxSize.replace("{size}", MAX_FILE_SIZE.toString())}
              </Typography>
              {state.uploadProgress !== undefined && state.uploadProgress > 0 && (
                <Box sx={{ width: '100%', mt: 2 }}>
                  <LinearProgress variant="determinate" value={state.uploadProgress} />
                  <Typography variant="caption" color="text.secondary">
                    {t.dataEntry.uploadProgress.replace("{progress}", state.uploadProgress.toString())}
                  </Typography>
                </Box>
              )}
            </Box>

            {state.formData.documents.length > 0 && (
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  {t.dataEntry.documents}:
                </Typography>
                {state.formData.documents.map((file, index) => (
                  <Typography key={index} variant="body2">
                    {file.name}
                  </Typography>
                ))}
              </Box>
            )}

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                onClick={() => navigate('/builder')}
                disabled={state.isSubmitting}
              >
                {t.dataEntry.cancel}
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={state.isSubmitting}
              >
                {state.isSubmitting ? t.dataEntry.saving : t.dataEntry.update}
              </Button>
            </Box>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default DataEntry;

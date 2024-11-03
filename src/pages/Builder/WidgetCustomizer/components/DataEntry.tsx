import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppContext } from '@/context/app';
import { ErrorToast, SuccessToast } from '@/components/Toast';
import { languages } from "@/utils/Traslations";
import useBotsApi from "@/hooks/useBots";
import { Box, TextField, Button, Typography, LinearProgress } from '@mui/material';
import { DataEntryState } from '@/types/DataEntry';

// Constantes
const MAX_FILE_SIZE = 10; // MB
const ALLOWED_FILE_TYPES = ['application/pdf', 'text/plain', 'application/msword'];

// Estado inicial
const initialState: DataEntryState = {
  isLoading: true,
  isError: false,
  isSubmitting: false,
  isEditing: false,
  searchQuery: '',
  contentPerPage: '5',
  isSearching: false,
  dragActive: false,
  uploadProgress: 0,
  formData: {
    context: '',
    documents: []
  }
};

export const DataEntry = () => {
  const navigate = useNavigate();
  const { botId } = useParams();
  const { auth, language, replacePath } = useAppContext();
  const { getBotDetails, updateBotData, uploadDocument } = useBotsApi();
  const [state, setState] = useState<DataEntryState>(initialState);
  const t = languages[language as keyof typeof languages];

  // Manejadores de estado
  const updateState = useCallback((updates: Partial<DataEntryState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const handleError = useCallback((error: Error | unknown) => {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    updateState({
      isLoading: false,
      isError: true,
      errorMessage
    });
    ErrorToast(t.actionAllower.fieldRequired);
    navigate('/builder');
  }, [navigate, t.actionAllower.fieldRequired, updateState]);

  // Inicialización
  const initializePage = useCallback(async () => {
    try {
      if (!auth?.uuid) throw new Error('User not authenticated');
      if (!botId) throw new Error('Bot ID is required');

      const botDetails = await getBotDetails(botId);
      if (!botDetails?.data) throw new Error('Bot not found');

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

      updateState({
        isLoading: false,
        formData: {
          context: botDetails.data.context || '',
          documents: []
        }
      });

    } catch (error) {
      handleError(error);
    }
  }, [auth?.uuid, botId, getBotDetails, handleError, replacePath, t.leftMenu.aiTeams, updateState]);

  useEffect(() => {
    initializePage();
  }, [initializePage]);

  // Validación de archivos
  const validateFile = useCallback((file: File): boolean => {
    const isValidSize = file.size <= MAX_FILE_SIZE * 1024 * 1024;
    const isValidType = ALLOWED_FILE_TYPES.includes(file.type);

    if (!isValidSize) {
      ErrorToast(t.dataEntry.maxSize.replace("{size}", MAX_FILE_SIZE.toString()));
      return false;
    }

    if (!isValidType) {
      ErrorToast(t.dataEntry.invalidType);
      return false;
    }

    return true;
  }, [t.dataEntry]);

  // Manejadores de eventos
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setState(prev => ({
      ...prev,
      formData: { ...prev.formData, [name]: value }
    }));
  }, []);

  const handleFileUpload = useCallback(async (files: File[]) => {
    if (!botId) return;

    try {
      updateState({ isSubmitting: true });

      for (const file of files) {
        if (validateFile(file)) {
          await uploadDocument(file, botId, (progress) => {
            updateState({ uploadProgress: progress });
          });
        }
      }

      SuccessToast(t.dataEntry.uploadSuccess);
      updateState({
        formData: { ...state.formData, documents: [] },
        uploadProgress: 0
      });
    } catch (error) {
      ErrorToast(t.dataEntry.uploadError);
      updateState({
        uploadError: t.dataEntry.uploadError,
        uploadProgress: 0
      });
    } finally {
      updateState({ isSubmitting: false });
    }
  }, [botId, state.formData, t.dataEntry, updateState, uploadDocument, validateFile]);

  const handleDrop = useCallback(async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    updateState({ dragActive: false });
    
    if (e.dataTransfer.files && botId) {
      const validFiles = Array.from(e.dataTransfer.files).filter(validateFile);
      if (validFiles.length > 0) {
        await handleFileUpload(validFiles);
      }
    }
  }, [botId, handleFileUpload, updateState, validateFile]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      updateState({ isSubmitting: true });

      if (!botId) throw new Error('Bot ID is required');

      // Convertir los datos para que coincidan con BotDataFormData
      const submissionData = {
        context: state.formData.context,
        documents: state.formData.documents
      } as const;

      const response = await updateBotData(submissionData, botId);

      if (response?.data) {
        SuccessToast(t.dataEntry.successUpdate);
        navigate(`/builder/agents/${response.data.name}/${response.data.id}`);
      }
    } catch (error) {
      ErrorToast(t.dataEntry.errorConnection);
    } finally {
      updateState({ isSubmitting: false, uploadProgress: 0 });
    }
  }, [botId, navigate, state.formData, t.dataEntry, updateBotData, updateState]);

  // Renderizado
  return (
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
        onDragEnter={(e) => { e.preventDefault(); updateState({ dragActive: true }); }}
        onDragOver={(e) => { e.preventDefault(); updateState({ dragActive: true }); }}
        onDragLeave={(e) => { e.preventDefault(); updateState({ dragActive: false }); }}
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
        {state?.uploadProgress && state.uploadProgress > 0 && (
          <Box sx={{ width: '100%', mt: 2 }}>
            <LinearProgress variant="determinate" value={state.uploadProgress} />
            <Typography variant="caption" color="text.secondary">
              {t.dataEntry.uploadProgress.replace("{progress}", state.uploadProgress.toString())}
            </Typography>
          </Box>
        )}
      </Box>

      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
        <Button
          variant="outlined"
          onClick={() => navigate('/builder')}
          disabled={state.isSubmitting}
        >
          {t.dataEntry.cancel}
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={state.isSubmitting}
        >
          {state.isSubmitting ? t.dataEntry.saving : t.dataEntry.update}
        </Button>
      </Box>
    </Box>
  );
};

export default DataEntry;

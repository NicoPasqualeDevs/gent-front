import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppContext } from '@/context';
import { ErrorToast, SuccessToast } from '@/components/Toast';
import { languages } from "@/utils/Traslations";
import useBotsApi from "@/hooks/useBots";
import { Box, TextField, Button, Typography, LinearProgress } from '@mui/material';
import { Search, SearchIconWrapper, StyledInputBase } from "@/components/SearchBar";
import SearchIcon from "@mui/icons-material/Search";

// Constantes
const MAX_FILE_SIZE = 10; // MB
const ALLOWED_FILE_TYPES = ['application/pdf', 'text/plain', 'application/msword'];

// Interfaces
interface KnowledgeSet {
  knowledge_key: string;
  context: string;
}

interface FormValues {
  knowledgeSets: KnowledgeSet[];
  documents: File[];
  context: string;
  [key: string]: KnowledgeSet[] | File[] | string;
}

interface FormState {
  loaded: boolean;
  isSubmitting: boolean;
  error: string | null;
  dragActive: boolean;
  uploadProgress: number;
}

export const DataEntry: React.FC = () => {
  const navigate = useNavigate();
  const { botId } = useParams();
  const { auth, language, replacePath } = useAppContext();
  const { getBotDetails, updateBotData, uploadDocument } = useBotsApi();
  const t = languages[language];

  // Estados principales
  const [formState, setFormState] = useState<FormState>({
    loaded: false,
    isSubmitting: false,
    error: null,
    dragActive: false,
    uploadProgress: 0
  });

  // Estado del formulario usando formik o estado simple
  const [formValues, setFormValues] = useState<FormValues>({
    knowledgeSets: [{
      knowledge_key: '',
      context: ''
    }],
    documents: [],
    context: ''
  });

  // Memoizamos la configuración inicial
  const config = useMemo(() => ({
    auth,
    botId,
    language
  }), [auth?.uuid, botId, language]);

  // Memoizamos los métodos de la API
  const apiMethods = useMemo(() => ({
    getBotDetails,
    updateBotData,
    uploadDocument
  }), [getBotDetails, updateBotData, uploadDocument]);

  // Agregamos estado para la búsqueda
  const [searchQuery, setSearchQuery] = useState('');

  // Filtramos los conjuntos basados en la búsqueda
  const filteredKnowledgeSets = useMemo(() => {
    return formValues.knowledgeSets.filter(set => 
      set.knowledge_key.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [formValues.knowledgeSets, searchQuery]);

  // Efecto para cargar datos iniciales
  useEffect(() => {
    let mounted = true;
    
    const loadData = async () => {
      if (!config.auth?.uuid || !config.botId) {
        console.log('Missing required data:', { auth: config.auth?.uuid, botId: config.botId });
        navigate('/builder');
        return;
      }

      try {
        console.log('Loading bot details...');
        const response = await apiMethods.getBotDetails(config.botId);
        
        if (!mounted) return;

        if (response?.data) {
          console.log('Bot details loaded:', response.data);
          setFormValues(prev => ({
            ...prev,
            context: response.data.context || '',
            knowledgeSets: prev.knowledgeSets,
            documents: prev.documents
          }));

          replacePath([
            {
              label: t.leftMenu.aiTeams,
              current_path: "/builder",
              preview_path: "/builder",
              translationKey: 'aiTeams'
            },
            {
              label: response.data.name,
              current_path: `/builder/agents/dataEntry/${config.botId}`,
              preview_path: "",
              translationKey: 'botDetails'
            },
          ]);
        }

        setFormState(prev => ({ ...prev, loaded: true }));
      } catch (error) {
        console.error('Error loading data:', error);
        if (mounted) {
          setFormState(prev => ({
            ...prev,
            loaded: true,
            error: error instanceof Error ? error.message : 'Unknown error'
          }));
          ErrorToast(t.dataEntry.errorConnection);
        }
      }
    };

    loadData();
    return () => { mounted = false; };
  }, [config.auth?.uuid, config.botId]);

  // Manejador de subida de archivos
  const handleFileUpload = useCallback(async (files: File[]) => {
    if (!config.botId || formState.isSubmitting) {
      console.log('Upload cancelled:', { botId: config.botId, isSubmitting: formState.isSubmitting });
      return;
    }

    try {
      setFormState(prev => ({ ...prev, isSubmitting: true }));
      console.log('Starting file upload...', files);

      for (const file of files) {
        if (validateFile(file)) {
          console.log('Uploading file:', file.name);
          await apiMethods.uploadDocument(file, config.botId);
        }
      }

      console.log('Upload completed successfully');
      SuccessToast(t.dataEntry.uploadSuccess);
      setFormValues(prev => ({ ...prev, documents: [] }));
      setFormState(prev => ({ ...prev, uploadProgress: 0 }));
    } catch (error) {
      console.error('Upload error:', error);
      ErrorToast(t.dataEntry.uploadError);
    } finally {
      setFormState(prev => ({ ...prev, isSubmitting: false }));
    }
  }, [config.botId, formState.isSubmitting, apiMethods.uploadDocument]);

  // Validación de archivos
  const validateFile = useCallback((file: File): boolean => {
    console.log('Validating file:', { name: file.name, size: file.size, type: file.type });
    
    const isValidSize = file.size <= MAX_FILE_SIZE * 1024 * 1024;
    const isValidType = ALLOWED_FILE_TYPES.includes(file.type);

    if (!isValidSize) {
      console.log('File size validation failed');
      ErrorToast(t.dataEntry.maxSize.replace("{size}", MAX_FILE_SIZE.toString()));
      return false;
    }

    if (!isValidType) {
      console.log('File type validation failed');
      ErrorToast(t.dataEntry.invalidType);
      return false;
    }

    console.log('File validation passed');
    return true;
  }, [t.dataEntry]);

  // Manejador de envío del formulario
   useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!config.botId || formState.isSubmitting) {
      console.log('Submit cancelled:', { botId: config.botId, isSubmitting: formState.isSubmitting });
      return;
    }

    try {
      console.log('Submitting form data:', formValues);
      setFormState(prev => ({ ...prev, isSubmitting: true }));

        const response = await apiMethods.updateBotData({
          context: formValues.context,
          documents: formValues.documents
        }, config.botId);

      if (response?.data) {
        console.log('Submit successful:', response.data);
        SuccessToast(t.dataEntry.successUpdate);
        navigate(`/builder/agents/${response.data.name}/${response.data.id}`);
      }
    } catch (error) {
      console.error('Submit error:', error);
      ErrorToast(t.dataEntry.errorConnection);
    } finally {
      setFormState(prev => ({ ...prev, isSubmitting: false }));
    }
  }, [config.botId, formState.isSubmitting, formValues, navigate]);

  // Manejador de selección de archivo
  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('File selection event:', e.target.files);
    if (e.target.files) {
      const validFiles = Array.from(e.target.files).filter(validateFile);
      if (validFiles.length > 0) {
        console.log('Valid files selected:', validFiles);
        handleFileUpload(validFiles);
      }
    }
  }, [handleFileUpload, validateFile]);

  // Manejador de drop
  const handleDrop = useCallback(async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    console.log('Drop event detected');
    setFormState(prev => ({ ...prev, dragActive: false }));

    if (e.dataTransfer.files && config.botId) {
      console.log('Files dropped:', e.dataTransfer.files);
      const validFiles = Array.from(e.dataTransfer.files).filter(validateFile);
      if (validFiles.length > 0) {
        console.log('Valid files dropped:', validFiles);
        await handleFileUpload(validFiles);
      }
    }
  }, [config.botId, handleFileUpload, validateFile]);

  // Función para agregar un nuevo conjunto
  const handleAddSet = useCallback(() => {
    console.log('Adding new knowledge set');
    setFormValues(prev => ({
      ...prev,
      knowledgeSets: [...prev.knowledgeSets, { knowledge_key: '', context: '' }]
    }));
  }, []);

  // Función para actualizar un conjunto específico
  const handleSetChange = useCallback((index: number, field: keyof KnowledgeSet, value: string) => {
    console.log('Updating knowledge set:', { index, field, value });
    setFormValues(prev => ({
      ...prev,
      knowledgeSets: prev.knowledgeSets.map((set, i) => 
        i === index ? { ...set, [field]: value } : set
      )
    }));
  }, []);

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      gap: 3,
      height: 'auto', // Aseguramos que el contenedor principal se ajuste al contenido
    }}>
      {/* Barra de búsqueda y botón de agregar */}
      <Box sx={{ 
        display: 'flex', 
        gap: 2,
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%' // Aseguramos que ocupe todo el ancho
      }}>
        <Search sx={{ 
          flex: 1,
          maxWidth: '400px',
          backgroundColor: 'background.paper',
          boxShadow: 1,
          borderRadius: 1
        }}>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder={t.dataEntry.searchKnowledge || "Buscar por clave de conocimiento..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </Search>

        <Button
          variant="contained"
          onClick={handleAddSet}
          sx={{
            minWidth: 'auto',
            whiteSpace: 'nowrap'
          }}
        >
          {t.dataEntry.addKnowledgeSet || "Agregar nuevo conjunto"}
        </Button>
      </Box>

      {/* Contenedor principal sin overflow */}
      <Box sx={{ 
        bgcolor: 'background.paper',
        borderRadius: 1,
        boxShadow: 1,
        width: '100%', // Aseguramos que ocupe todo el ancho
        height: 'auto' // Altura automática
      }}>
        {/* Contenedor con scroll para los conjuntos */}
        <Box sx={{ 
          maxHeight: '350px', // Altura máxima para el scroll
          overflow: 'auto',
          p: 1.5
        }}>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: 1.5,
          }}>
            {filteredKnowledgeSets.length > 0 ? (
              filteredKnowledgeSets.map((set, index) => (
                <Box 
                  key={index}
                  sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: 1.5, // Reducimos el gap de 2 a 1.5
                    p: 1.5, // Reducimos el padding de 2 a 1.5
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1,
                    bgcolor: 'background.default'
                  }}
                >
                  <Typography variant="subtitle1" sx={{ 
                    fontWeight: 'bold',
                    fontSize: '0.95rem' // Reducimos ligeramente el tamaño del título
                  }}>
                    {`${t.dataEntry.knowledgeSet || 'Conjunto de conocimiento'} ${index + 1}`}
                  </Typography>
                  
                  <TextField
                    name={`knowledge_key_${index}`}
                    label={t.dataEntry.knowledgeKey || "Clave de conocimiento"}
                    value={set.knowledge_key}
                    onChange={(e) => handleSetChange(index, 'knowledge_key', e.target.value)}
                    fullWidth
                    required
                    size="small" // Hacemos el input más compacto
                    helperText={t.dataEntry.knowledgeKeyHelper || "Ingrese una clave para identificar este conocimiento"}
                  />

                  <TextField
                    name={`context_${index}`}
                    label={t.dataEntry.context}
                    value={set.context}
                    onChange={(e) => handleSetChange(index, 'context', e.target.value)}
                    multiline
                    rows={4} // Reducimos las filas de 6 a 4
                    fullWidth
                    required
                    size="small" // Hacemos el input más compacto
                  />
                </Box>
              ))
            ) : (
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                p: 4
              }}>
                <Typography color="text.secondary">
                  {searchQuery 
                    ? (t.dataEntry.noKnowledgeFound || "No se encontraron conjuntos con esa clave")
                    : (t.dataEntry.noKnowledgeSets || "No hay conjuntos de conocimiento")}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Box>

      {/* Área de drop para documentos */}
      <Box
        onDragEnter={(e) => { e.preventDefault(); setFormState({ ...formState, dragActive: true }); }}
        onDragOver={(e) => { e.preventDefault(); setFormState({ ...formState, dragActive: true }); }}
        onDragLeave={(e) => { e.preventDefault(); setFormState({ ...formState, dragActive: false }); }}
        onDrop={handleDrop}
        sx={{
          position: 'relative',
          border: '2px dashed',
          borderColor: formState.dragActive ? 'primary.main' : 'divider',
          borderRadius: 1,
          p: 3,
          textAlign: 'center',
          cursor: 'pointer',
          transition: 'border-color 0.2s',
          width: '100%', // Aseguramos que ocupe todo el ancho
          '&:hover': {
            borderColor: 'primary.main',
          },
        }}
      >
        <input
          type="file"
          multiple
          onChange={handleFileSelect}
          accept={ALLOWED_FILE_TYPES.join(',')}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            opacity: 0,
            cursor: 'pointer'
          }}
        />
        <Typography>{t.dataEntry.dragAndDrop}</Typography>
        <Typography variant="caption" color="text.secondary">
          {t.dataEntry.maxSize.replace("{size}", MAX_FILE_SIZE.toString())}
        </Typography>
        {formState.uploadProgress && formState.uploadProgress > 0 && (
          <Box sx={{ width: '100%', mt: 2 }}>
            <LinearProgress variant="determinate" value={formState.uploadProgress} />
            <Typography variant="caption" color="text.secondary">
              {t.dataEntry.uploadProgress.replace("{progress}", formState.uploadProgress.toString())}
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default DataEntry;

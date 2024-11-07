import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppContext } from '@/context';
import { ErrorToast, SuccessToast } from '@/components/Toast';
import { languages } from "@/utils/Traslations";
import useBotsApi from "@/hooks/useBots";
import { Box, TextField, Button, Typography, LinearProgress, CircularProgress } from '@mui/material';
import { Search, SearchIconWrapper, StyledInputBase } from "@/components/SearchBar";
import SearchIcon from "@mui/icons-material/Search";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import SaveIcon from '@mui/icons-material/Save';
import ChatIcon from '@mui/icons-material/Chat';

// Constantes
const MAX_FILE_SIZE = 10; // MB
const ALLOWED_FILE_TYPES = ['application/pdf', 'text/plain', 'application/msword'];

// Interfaces
interface KnowledgeSet {
  id?: string;
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
  loadingKnowledge: boolean;
}

export const DataEntry: React.FC = () => {
  const navigate = useNavigate();
  const { botId } = useParams();
  const { auth, language, replacePath } = useAppContext();
  const { getBotDetails, updateBotData, uploadDocument, getKnowledgeTags, createKnowledgeTag, updateKnowledgeTag, deleteKnowledgeTag } = useBotsApi();
  const t = languages[language];

  // Estados principales
  const [formState, setFormState] = useState<FormState>({
    loaded: false,
    isSubmitting: false,
    error: null,
    dragActive: false,
    uploadProgress: 0,
    loadingKnowledge: true
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
    return formValues.knowledgeSets.filter((set, index) => 
      set.knowledge_key.toLowerCase().includes(searchQuery.toLowerCase()) ||
      `${t.dataEntry.knowledgeSet || 'Conjunto de conocimiento'} ${index + 1}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );
  }, [formValues.knowledgeSets, searchQuery, t.dataEntry.knowledgeSet]);

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

  // Agregamos una referencia para el contenedor de scroll
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // Función para hacer scroll a la última etiqueta
  const scrollToLastTag = useCallback(() => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      container.scrollTop = container.scrollHeight;
    }
  }, []);

  // Función para agregar un nuevo conjunto
  const handleAddSet = useCallback(() => {
    console.log('Adding new knowledge set');
    setFormValues(prev => ({
      ...prev,
      knowledgeSets: [...prev.knowledgeSets, { knowledge_key: '', context: '' }]
    }));
    // Agregamos un pequeño delay para asegurar que el DOM se ha actualizado
    setTimeout(scrollToLastTag, 100);
  }, [scrollToLastTag]);

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

  // Efecto para cargar los ktags iniciales
  useEffect(() => {
    const loadKnowledgeTags = async () => {
      if (!config.botId) return;

      try {
        setFormState(prev => ({ ...prev, loadingKnowledge: true }));
        const response = await getKnowledgeTags(config.botId);
        if (response?.data) {
          setFormValues(prev => ({
            ...prev,
            knowledgeSets: response.data.map(tag => ({
              id: tag.id,
              knowledge_key: tag.name,
              context: tag.value
            }))
          }));
          // Agregamos scroll después de cargar las etiquetas
          setTimeout(scrollToLastTag, 100);
        }
      } catch (error) {
        console.error('Error loading knowledge tags:', error);
        ErrorToast('Error al cargar los conjuntos de conocimiento');
      } finally {
        setFormState(prev => ({ ...prev, loadingKnowledge: false }));
      }
    };

    loadKnowledgeTags();
  }, [config.botId, scrollToLastTag]);

  // Agregamos un estado para controlar qué etiqueta se está guardando
  const [savingTagIndex, setSavingTagIndex] = useState<number | null>(null);

  // Modificamos la función handleSaveSet
  const handleSaveSet = async (index: number) => {
    const set = formValues.knowledgeSets[index];
    if (!config.botId) return;

    const tagData = {
      name: set.knowledge_key,
      value: set.context,
      description: set.knowledge_key,
      customer_bot: config.botId
    };

    try {
      setSavingTagIndex(index); // Indicamos qué etiqueta se está guardando
      
      if (set.id) {
        await updateKnowledgeTag(set.id, tagData);
      } else {
        const response = await createKnowledgeTag(config.botId, tagData);
        setFormValues(prev => ({
          ...prev,
          knowledgeSets: prev.knowledgeSets.map((s, i) => 
            i === index ? { ...s, id: response.data.id } : s
          )
        }));
      }
      SuccessToast('Conjunto de conocimiento guardado correctamente');
    } catch (error) {
      console.error('Error saving knowledge tag:', error);
      ErrorToast('Error al guardar el conjunto de conocimiento');
    } finally {
      setSavingTagIndex(null); // Limpiamos el índice al terminar
    }
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      gap: 3,
      height: 'auto', // Aseguramos que el contenedor principal se ajuste al contenido
    }}>
      {/* Barra de búsqueda y botones */}
      <Box sx={{ 
        display: 'flex', 
        gap: 2,
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%'
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

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            onClick={() => navigate(`/chat/${botId}`)}
            startIcon={<ChatIcon />}
            sx={{
              minWidth: '140px',
              whiteSpace: 'nowrap',
            }}
          >
            {"Probar Bot"}
          </Button>

          <Button
            variant="contained"
            onClick={handleAddSet}
            sx={{
              minWidth: '180px',
              whiteSpace: 'nowrap',
              color: 'white',
              '&:hover': {
                color: 'white'
              }
            }}
          >
            {t.dataEntry.addKnowledgeSet || "Agregar nuevo conjunto"}
          </Button>
        </Box>
      </Box>

      {/* Contenedor principal sin overflow */}
      <Box sx={{ 
        bgcolor: 'background.paper',
        borderRadius: 1,
        boxShadow: 1,
        width: '100%',
        height: 'auto'
      }}>
        {/* Contenedor con scroll para los conjuntos */}
        <Box 
          ref={scrollContainerRef}
          sx={{ 
            maxHeight: '510px',
            overflow: 'auto',
            p: 1.5,
            minHeight: '200px',
          }}
        >
          {formState.loadingKnowledge ? (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              height: '100%',
              minHeight: '200px' 
            }}>
              <CircularProgress />
            </Box>
          ) : (
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: 1.5,
              width: '100%',
              minHeight: 'min-content'
            }}>
              {filteredKnowledgeSets.length > 0 ? (
                filteredKnowledgeSets.map((set, index) => (
                  <Box 
                    key={index}
                    sx={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      gap: 1.5,
                      p: 1.5,
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 1,
                      bgcolor: 'background.default',
                      position: 'relative'
                    }}
                  >
                    {/* Botones de acción */}
                    <Box sx={{ 
                      position: 'absolute',
                      right: '12px',
                      top: '12px',
                      display: 'flex',
                      gap: 1
                    }}>
                      <Button
                        onClick={() => handleSaveSet(index)}
                        disabled={savingTagIndex === index}
                        sx={{
                          minWidth: '32px',
                          width: '32px',
                          height: '32px',
                          padding: 0,
                          borderRadius: '50%',
                          color: 'success.main',
                          '&:hover': {
                            backgroundColor: 'success.lighter',
                          }
                        }}
                      >
                        {savingTagIndex === index ? (
                          <CircularProgress
                            size={20}
                            sx={{ color: 'success.main' }}
                          />
                        ) : (
                          <SaveIcon sx={{ fontSize: 20 }} />
                        )}
                      </Button>
                      <Button
                        onClick={() => {
                          if (set.id) {
                            deleteKnowledgeTag(set.id)
                              .then(() => {
                                setFormValues(prev => ({
                                  ...prev,
                                  knowledgeSets: prev.knowledgeSets.filter((_, i) => i !== index)
                                }));
                                SuccessToast('Conjunto de conocimiento eliminado correctamente');
                              })
                              .catch(() => {
                                ErrorToast('Error al eliminar el conjunto de conocimiento');
                              });
                          } else {
                            setFormValues(prev => ({
                              ...prev,
                              knowledgeSets: prev.knowledgeSets.filter((_, i) => i !== index)
                            }));
                          }
                        }}
                        sx={{
                          minWidth: '32px',
                          width: '32px',
                          height: '32px',
                          padding: 0,
                          borderRadius: '50%',
                          color: 'error.main',
                          '&:hover': {
                            backgroundColor: 'error.lighter',
                          }
                        }}
                      >
                        <DeleteOutlineIcon sx={{ fontSize: 20 }} />
                      </Button>
                    </Box>

                    <Typography variant="subtitle1" sx={{ 
                      fontWeight: 'bold',
                      fontSize: '0.95rem',
                      pr: 5,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}>
                      {`${t.dataEntry.knowledgeSet || 'Conjunto de conocimiento'} ${index + 1}`}
                      {set.id && (
                        <Typography 
                          component="span" 
                          sx={{ 
                            color: 'success.main',
                            fontSize: '0.75rem',
                            fontWeight: 'normal'
                          }}
                        >
                          ({'Guardado'})
                        </Typography>
                      )}
                    </Typography>
                    
                    <TextField
                      name={`knowledge_key_${index}`}
                      label={t.dataEntry.knowledgeKey || "Clave de conocimiento"}
                      value={set.knowledge_key}
                      onChange={(e) => handleSetChange(index, 'knowledge_key', e.target.value)}
                      fullWidth
                      required
                      size="small"
                      helperText={t.dataEntry.knowledgeKeyHelper || "Ingrese una clave para identificar este conocimiento"}
                    />

                    <TextField
                      name={`context_${index}`}
                      label={t.dataEntry.context}
                      value={set.context}
                      onChange={(e) => handleSetChange(index, 'context', e.target.value)}
                      multiline
                      rows={4}
                      fullWidth
                      required
                      size="small"
                    />
                  </Box>
                ))
              ) : (
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center',
                  minHeight: '200px'
                }}>
                  <Typography color="text.secondary">
                    {searchQuery 
                      ? (t.dataEntry.noKnowledgeFound || "No se encontraron conjuntos con esa clave")
                      : (t.dataEntry.noKnowledgeSets || "No hay conjuntos de conocimiento")}
                  </Typography>
                </Box>
              )}
            </Box>
          )}
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
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '120px',
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
        <Typography variant="body1" sx={{ mb: 1 }}>{t.dataEntry.dragAndDrop}</Typography>
        <Typography variant="caption" color="text.secondary">
          {t.dataEntry.maxSize.replace("{size}", MAX_FILE_SIZE.toString())}
        </Typography>
        {formState.uploadProgress > 0 && (
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

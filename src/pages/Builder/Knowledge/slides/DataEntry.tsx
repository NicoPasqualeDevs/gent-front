import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppContext } from '@/context';
import { ErrorToast, SuccessToast } from '@/components/Toast';
import { languages } from "@/utils/Traslations";
import useAgents from "@/hooks/apps/agents";
import { Box, TextField, Button, Typography, LinearProgress, CircularProgress } from '@mui/material';
import { Search, SearchIconWrapper, StyledInputBase } from "@/components/SearchBar";
import SearchIcon from "@mui/icons-material/Search";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import SaveIcon from '@mui/icons-material/Save';
import ChatIcon from '@mui/icons-material/Chat';
import { Ktag } from '@/types/ContextEntry';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Fade, Slide } from '@mui/material';

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
  const { agentId } = useParams();
  const { auth, language, replacePath } = useAppContext();
  const { getAgentDetails, updateAgentData, uploadDocument, getKnowledgeTags, createKnowledgeTag, updateKnowledgeTag, deleteKnowledgeTag } = useAgents();
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
    agentId,
    language
  }), [auth?.uuid, agentId, language]);

  // Memoizamos los métodos de la API
  const apiMethods = useMemo(() => ({
    getAgentDetails,
    updateAgentData,
    uploadDocument
  }), [getAgentDetails, updateAgentData, uploadDocument]);

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
      if (!config.auth?.uuid || !config.agentId) {
        console.log('Missing required data:', { auth: config.auth?.uuid, agentId: config.agentId });
        navigate('/builder');
        return;
      }

      try {
        console.log('Loading bot details...');
        const response = await apiMethods.getAgentDetails(config.agentId);
        
        if (!mounted) return;

        if (response?.data) {
          console.log('Bot details loaded:', response.data);
          setFormValues(prev => ({
            ...prev,
            context: response.data.context ?? '',
            knowledgeSets: prev.knowledgeSets,
            documents: prev.documents
          }));

          replacePath([
            {
              label: t.leftMenu.teams,
              current_path: "/builder",
              preview_path: "/builder",
              translationKey: 'teams'
            },
            {
              label: response.data.name,
              current_path: `/builder/agents/dataEntry/${config.agentId}`,
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
  }, [config.auth?.uuid, config.agentId]);

  // Manejador de subida de archivos
  const handleFileUpload = useCallback(async (files: File[]) => {
    if (!config.agentId || formState.isSubmitting) {
      console.log('Upload cancelled:', { agentId: config.agentId, isSubmitting: formState.isSubmitting });
      return;
    }

    try {
      setFormState(prev => ({ ...prev, isSubmitting: true }));
      console.log('Starting file upload...', files);

      for (const file of files) {
        if (validateFile(file)) {
          console.log('Uploading file:', file.name);
          await apiMethods.uploadDocument(file, config.agentId);
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
  }, [config.agentId, formState.isSubmitting, apiMethods.uploadDocument]);

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
    if (!config.agentId || formState.isSubmitting) {
      console.log('Submit cancelled:', { agentId: config.agentId, isSubmitting: formState.isSubmitting });
      return;
    }

    try {
      console.log('Submitting form data:', formValues);
      setFormState(prev => ({ ...prev, isSubmitting: true }));

        const response = await apiMethods.updateAgentData({
          context: formValues.context,
          documents: formValues.documents
        }, config.agentId);

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
  }, [config.agentId, formState.isSubmitting, formValues, navigate]);

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

    if (e.dataTransfer.files && config.agentId) {
      console.log('Files dropped:', e.dataTransfer.files);
      const validFiles = Array.from(e.dataTransfer.files).filter(validateFile);
      if (validFiles.length > 0) {
        console.log('Valid files dropped:', validFiles);
        await handleFileUpload(validFiles);
      }
    }
  }, [config.agentId, handleFileUpload, validateFile]);

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
    const newIndex = formValues.knowledgeSets.length;
    setFormValues(prev => ({
      ...prev,
      knowledgeSets: [...prev.knowledgeSets, { knowledge_key: '', context: '' }]
    }));
    // Expandimos inmediatamente la nueva ktag
    setTimeout(() => {
      setExpandedIndex(newIndex);
    }, 100);
  }, [formValues.knowledgeSets.length]);

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
      if (!config.agentId) return;

      try {
        setFormState(prev => ({ ...prev, loadingKnowledge: true }));
        const response = await getKnowledgeTags(config.agentId);
        if (response?.data) {
          // Convertir los Ktag a KnowledgeSet
          const tags = response.data.map(tag => ({
            id: tag.id,
            knowledge_key: tag.name,
            context: tag.value
          }));
          setFormValues(prev => ({
            ...prev,
            knowledgeSets: tags
          }));
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
  }, [config.agentId, scrollToLastTag]);

  // Agregamos un estado para controlar qué etiqueta se está guardando
  const [savingTagIndex, setSavingTagIndex] = useState<number | null>(null);

  // Modificamos la función handleSaveSet
  const handleSaveSet = async (index: number) => {
    const set = formValues.knowledgeSets[index];
    if (!config.agentId) return;

    const tagData: Ktag = {
      name: set.knowledge_key,
      value: set.context,
      agent: config.agentId,
      id: set.id ?? ''
    };

    try {
      setSavingTagIndex(index);
      
      if (set.id) {
        await updateKnowledgeTag(config.agentId, set.id, tagData);
      } else {
        const response = await createKnowledgeTag(config.agentId, tagData);
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
      setSavingTagIndex(null);
    }
  };

  // Agregar este nuevo estado para controlar el Accordion expandido
  const [expandedIndex, setExpandedIndex] = useState<number | false>(false);

  // Agregar esta función para manejar el cambio de expansión
  const handleAccordionChange = (index: number) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedIndex(isExpanded ? index : false);
  };

  // Agregar estos estados nuevos
  const [selectedItemPosition, setSelectedItemPosition] = useState<{ top: number; left: number } | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  // Modificar la función que maneja el click
  const handleItemClick = (index: number, event: React.MouseEvent<HTMLElement>) => {
    if (expandedIndex === index) {
      setExpandedIndex(false);
      return;
    }

    const element = event.currentTarget;
    const rect = element.getBoundingClientRect();
    const scrollTop = scrollContainerRef.current?.scrollTop || 0;
    
    // Guardamos la posición inicial
    setSelectedItemPosition({
      top: rect.top + scrollTop,
      left: rect.left
    });
    
    setIsAnimating(true);
    setExpandedIndex(index);

    // Resetear la posición después de la animación
    setTimeout(() => {
      setIsAnimating(false);
    }, 1000);
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      gap: 3,
      height: '100%',
    }}>
      {/* Contenedor principal */}
      <Box sx={{ 
        bgcolor: 'background.paper',
        borderRadius: 1,
        boxShadow: 1,
        width: '100%',
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        minHeight: expandedIndex !== false ? '100%' : 'calc(100% - 93px)',
      }}>
        {/* Buscador y botón fijos */}
        {expandedIndex === false && (
          <Box sx={{ 
            display: 'flex',
            gap: 2,
            width: '100%',
            p: 1.5,
            borderBottom: '1px solid',
            borderColor: 'divider',
            backgroundColor: 'background.paper',
          }}>
            <Search sx={{ 
              flex: 1,
              backgroundColor: 'background.paper',
              boxShadow: 1,
              borderRadius: 1,
              display: 'flex',
              alignItems: 'center',
            }}>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder={t.dataEntry.searchKnowledge || "Buscar por clave de conocimiento..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{
                  flex: 1,
                  '& .MuiInputBase-input': {
                    padding: '8px 8px 8px 0',
                    height: '24px',
                    lineHeight: '24px',
                  },
                  '& input': {
                    paddingLeft: '48px !important',
                  },
                  '& input::placeholder': {
                    paddingLeft: '0 !important',
                    opacity: 1,
                  }
                }}
              />
            </Search>

            <Button
              onClick={handleAddSet}
              sx={{
                height: '48px',
                borderRadius: 1,
                border: '1px dashed',
                borderColor: 'divider',
                backgroundColor: 'background.default',
                justifyContent: 'flex-start',
                pl: 2,
                pr: 2,
                color: 'text.secondary',
                whiteSpace: 'nowrap',
                minWidth: '240px',
                width: '240px',
                '&:hover': {
                  backgroundColor: 'background.default',
                  borderColor: 'primary.main',
                  color: 'primary.main',
                }
              }}
            >
              + {t.dataEntry.addKnowledgeSet || "Agregar nuevo conjunto"}
            </Button>
          </Box>
        )}

        {/* Contenedor de ktags con scroll */}
        <Box 
          ref={scrollContainerRef}
          sx={{ 
            flex: 1,
            position: 'relative',
            p: 1.5,
            overflow: expandedIndex === false ? 'auto' : 'hidden',
            '&::-webkit-scrollbar': {
              width: '6px',
              backgroundColor: 'transparent',
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: 'transparent',
              margin: '4px 0',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'primary.main',
              opacity: 0.3,
              borderRadius: '3px',
              '&:hover': {
                backgroundColor: 'primary.dark',
                opacity: 0.5,
              }
            },
            overflowX: 'hidden',
            msOverflowStyle: 'none',
            scrollbarWidth: 'thin',
            scrollbarColor: 'var(--mui-palette-primary-main) transparent',
          }}
        >
          {formState.loadingKnowledge ? (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              height: '100%',
            }}>
              <CircularProgress />
            </Box>
          ) : (
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: 1.5,
              width: '100%',
              height: '100%',
            }}>
              {filteredKnowledgeSets.length > 0 ? (
                <>
                  {filteredKnowledgeSets.map((set, index) => (
                    <Fade 
                      key={index}
                      in={expandedIndex === false || expandedIndex === index}
                      timeout={1000}
                    >
                      <Box
                        onClick={(e) => handleItemClick(index, e)}
                        sx={{
                          bgcolor: 'background.default',
                          borderRadius: 1,
                          cursor: 'pointer',
                          position: isAnimating && expandedIndex === index ? 'fixed' : 'relative',
                          top: isAnimating && expandedIndex === index ? 
                            `${selectedItemPosition?.top}px` : 
                            expandedIndex === index ? 0 : 'auto',
                          left: isAnimating && expandedIndex === index ? 
                            `${selectedItemPosition?.left}px` : 
                            expandedIndex === index ? 0 : 'auto',
                          width: expandedIndex === index ? '100%' : 'auto',
                          height: expandedIndex === index ? '100%' : 'auto',
                          transition: 'all 1s ease',
                          transform: expandedIndex === index && !isAnimating ? 
                            'translate(0, 0)' : 
                            'none',
                          opacity: expandedIndex !== false && expandedIndex !== index ? 0 : 1,
                          visibility: expandedIndex !== false && expandedIndex !== index ? 'hidden' : 'visible',
                          zIndex: expandedIndex === index ? 1000 : 1,
                          '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: '90px',
                            bottom: 0,
                            backgroundColor: 'primary.main',
                            opacity: 0,
                            transition: 'opacity 1s ease',
                            borderRadius: 1,
                            zIndex: 0,
                          },
                          '&:hover': {
                            '&::before': {
                              opacity: expandedIndex === false ? 1 : 0,
                            },
                            '& .ktag-title': {
                              color: expandedIndex === false ? 'primary.contrastText' : 'inherit',
                              zIndex: 1,
                            },
                          },
                          ...(expandedIndex === index && {
                            position: 'absolute',
                            left: 0,
                            right: 0,
                            top: 0,
                            bottom: 0,
                            zIndex: 10,
                            margin: '0 !important',
                            boxShadow: 3,
                            backgroundColor: 'background.paper',
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            '&::before': {
                              display: 'none',
                            },
                          })
                        }}
                      >
                        {/* Header */}
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            minHeight: '48px',
                            px: 2,
                            position: 'relative',
                            transition: 'all 1s ease',
                            backgroundColor: expandedIndex === index ? 'primary.light' : 'transparent',
                            borderTopLeftRadius: 1,
                            borderTopRightRadius: 1,
                            '& .MuiButton-root': {
                              transition: 'all 1s ease',
                              transform: expandedIndex === index ? 'scale(1)' : 'scale(0.9)',
                            },
                            '& .ktag-title': {
                              transition: 'all 1s ease',
                              color: expandedIndex === index ? 'primary.contrastText' : 'text.primary',
                            },
                            '& .MuiSvgIcon-root': {
                              transition: 'all 1s ease',
                              color: expandedIndex === index ? 'primary.contrastText' : 'text.secondary',
                            }
                          }}
                        >
                          <Typography 
                            className="ktag-title"
                            sx={{ 
                              fontWeight: 'bold',
                              fontSize: '0.95rem',
                              flex: 1,
                              position: 'relative',
                              transition: 'all 1s ease',
                            }}
                          >
                            {set.knowledge_key || `${t.dataEntry.knowledgeSet || 'Conjunto de conocimiento'} ${index + 1}`}
                          </Typography>
                          
                          <Box sx={{ 
                            display: 'flex', 
                            gap: 1,
                            alignItems: 'center',
                            position: 'relative',
                            zIndex: 2,
                            transition: 'all 1s ease',
                          }}>
                            {expandedIndex === index && (
                              <Fade in={expandedIndex === index} timeout={1000}>
                                <Button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleSaveSet(index);
                                  }}
                                  disabled={savingTagIndex === index}
                                  sx={{
                                    minWidth: '32px',
                                    width: '32px',
                                    height: '32px',
                                    padding: 0,
                                    borderRadius: '50%',
                                    color: 'success.main',
                                    backgroundColor: 'background.paper',
                                    transition: 'all 1s ease',
                                    '&:hover': {
                                      backgroundColor: 'background.paper',
                                    }
                                  }}
                                >
                                  {savingTagIndex === index ? (
                                    <CircularProgress size={20} sx={{ color: 'success.main' }} />
                                  ) : (
                                    <SaveIcon sx={{ fontSize: 20 }} />
                                  )}
                                </Button>
                              </Fade>
                            )}
                            <Button
                              className="delete-button"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (set.id && config.agentId) {
                                  deleteKnowledgeTag(config.agentId, set.id)
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
                                backgroundColor: expandedIndex === index ? 'background.paper' : 'transparent',
                                '&:hover': {
                                  backgroundColor: expandedIndex === index ? 'background.paper' : 'error.lighter',
                                }
                              }}
                            >
                              <DeleteOutlineIcon sx={{ fontSize: 20 }} />
                            </Button>
                            <ExpandMoreIcon 
                              sx={{ 
                                transform: expandedIndex === index ? 'rotate(180deg)' : 'none',
                                transition: 'transform 0.3s',
                                color: expandedIndex === index ? 'primary.contrastText' : 'text.secondary',
                              }} 
                            />
                          </Box>
                        </Box>

                        {/* Contenido */}
                        {expandedIndex === index && (
                          <Fade 
                            in={expandedIndex === index} 
                            timeout={1000}
                            style={{ transitionDelay: '2000ms' }}
                          >
                            <Box 
                              sx={{ 
                                p: 3,
                                flex: 1,
                                display: 'flex',
                                flexDirection: 'column',
                                minHeight: '640px',
                                height: '100%',
                                opacity: 0,
                                animation: 'fadeIn 1s ease 2s forwards',
                                '@keyframes fadeIn': {
                                  from: { opacity: 0 },
                                  to: { opacity: 1 }
                                }
                              }}
                            >
                              <Box sx={{ 
                                display: 'flex', 
                                flexDirection: 'column', 
                                gap: 2,
                                height: '100%',
                              }}>
                                <TextField
                                  name={`knowledge_key_${index}`}
                                  label={t.dataEntry.knowledgeKey || "Clave de conocimiento"}
                                  value={set.knowledge_key}
                                  onChange={(e) => handleSetChange(index, 'knowledge_key', e.target.value)}
                                  fullWidth
                                  required
                                  size="small"
                                  helperText={t.dataEntry.knowledgeKeyHelper || "Ingrese una clave para identificar este conocimiento"}
                                  sx={{ flexShrink: 0 }}
                                />

                                <TextField
                                  name={`context_${index}`}
                                  label={t.dataEntry.context}
                                  value={set.context}
                                  onChange={(e) => handleSetChange(index, 'context', e.target.value)}
                                  multiline
                                  fullWidth
                                  required
                                  size="small"
                                  sx={{ 
                                    flex: 1,
                                    display: 'flex',
                                    height: '500px',
                                    minHeight: '520px',
                                    '& .MuiInputBase-root': {
                                      height: '100%',
                                      minHeight: '520px',
                                      alignItems: 'flex-start',
                                    },
                                    '& .MuiInputBase-input': {
                                      height: 'calc(100% - 32px) !important',
                                      minHeight: 'calc(520px - 32px) !important',
                                      overflow: 'auto !important',
                                    }
                                  }}
                                />
                              </Box>
                            </Box>
                          </Fade>
                        )}
                      </Box>
                    </Fade>
                  ))}
                </>
              ) : (
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  gap: 2,
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

      {/* Área de drop */}
      <Fade in={expandedIndex === false}>
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
            p: 1.5,
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'border-color 0.2s',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '70px',
            flexShrink: 0,
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
      </Fade>
    </Box>
  );
};

export default DataEntry;

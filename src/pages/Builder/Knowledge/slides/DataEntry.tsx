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
import { Ktag } from '@/types/ContextEntry';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Fade } from '@mui/material';

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
      
      // Iniciamos el proceso de cierre animado
      setIsClosing(true);
      setLastClosedIndex(index); // Guardamos el índice para la iluminación
      setTimeout(() => {
        setExpandedIndex(false);
        setIsClosing(false);
        // Esperamos a que termine la animación del contenedor antes de restaurar el scroll
        setTimeout(() => {
          if (scrollContainerRef.current) {
            scrollContainerRef.current.style.scrollBehavior = 'smooth';
            scrollContainerRef.current.scrollTop = savedScrollPosition;
            setTimeout(() => {
              if (scrollContainerRef.current) {
                scrollContainerRef.current.style.scrollBehavior = 'auto';
              }
              // Limpiamos el lastClosedIndex después de la iluminación
              setTimeout(() => {
                setLastClosedIndex(null);
              }, 500);
            }, 1000);
          }
        }, 250);
      }, 250);

    } catch (error) {
      console.error('Error saving knowledge tag:', error);
      ErrorToast('Error al guardar el conjunto de conocimiento');
    } finally {
      setSavingTagIndex(null);
    }
  };

  // Agregar este nuevo estado para controlar el Accordion expandido
  const [expandedIndex, setExpandedIndex] = useState<number | false>(false);

  // Agregar estos estados nuevos
  const [selectedItemPosition, setSelectedItemPosition] = useState<{ top: number; left: number } | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  // Primero, agregamos un nuevo estado para controlar la animación de salida
  const [isClosing, setIsClosing] = useState(false);

  // Agregar un nuevo estado para guardar la posición del scroll
  const [savedScrollPosition, setSavedScrollPosition] = useState<number>(0);

  // Agregar un nuevo estado para rastrear la última etiqueta cerrada
  const [lastClosedIndex, setLastClosedIndex] = useState<number | null>(null);

  // Modificar la función handleItemClick
  const handleItemClick = (index: number, event: React.MouseEvent<HTMLElement>) => {
    const isHeader = (event.target as HTMLElement).closest('[data-header="true"]');
    if (expandedIndex === index && !isHeader) {
      return;
    }

    if (expandedIndex === index) {
      setIsClosing(true);
      setLastClosedIndex(index); // Guardamos el índice de la etiqueta que se está cerrando
      setTimeout(() => {
        setExpandedIndex(false);
        setIsClosing(false);
        // Esperamos a que termine la animación del contenedor antes de restaurar el scroll
        setTimeout(() => {
          if (scrollContainerRef.current) {
            scrollContainerRef.current.style.scrollBehavior = 'smooth';
            scrollContainerRef.current.scrollTop = savedScrollPosition;
            setTimeout(() => {
              if (scrollContainerRef.current) {
                scrollContainerRef.current.style.scrollBehavior = 'auto';
              }
              // Limpiamos el lastClosedIndex después de la iluminación
              setTimeout(() => {
                setLastClosedIndex(null);
              }, 500); // Duración de la iluminación
            }, 1000);
          }
        }, 250);
      }, 250);
      return;
    }

    // Guardar la posición actual del scroll antes de abrir
    if (scrollContainerRef.current) {
      setSavedScrollPosition(scrollContainerRef.current.scrollTop);
      // Resetear el scroll a 0 inmediatamente sin transición
      scrollContainerRef.current.style.scrollBehavior = 'auto';
      scrollContainerRef.current.scrollTop = 0;
    }
    
    // Obtener las dimensiones del contenedor padre
    const containerRect = scrollContainerRef.current?.getBoundingClientRect();
    const element = event.currentTarget;
    const elementRect = element.getBoundingClientRect();
    
    if (containerRect) {
      const top = containerRect.top + (containerRect.height - elementRect.height) / 2;
      const left = containerRect.left + (containerRect.width - elementRect.width) / 2;
      
      setSelectedItemPosition({
        top,
        left
      });
    }
    
    setIsAnimating(true);
    setExpandedIndex(index);

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
        transition: 'min-height 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
      }}>
        {/* Buscador y botón fijos */}
        {expandedIndex === false && (
          <Fade 
            in={expandedIndex === false} 
            timeout={750} // Mismo tiempo que los otros elementos
          >
            <Box sx={{ 
              display: 'flex',
              gap: 2,
              width: '100%',
              p: 1.5,
              borderBottom: '1px solid',
              borderColor: 'divider',
              backgroundColor: 'background.paper',
              opacity: isClosing ? 0 : 1,
              transition: 'opacity 0.375s cubic-bezier(0.4, 0, 0.2, 1)',
            }}>
              <Search sx={{ 
                flex: 1,
                backgroundColor: 'background.paper',
                boxShadow: 1,
                borderRadius: 1,
                display: 'flex',
                alignItems: 'center',
                opacity: isClosing ? 0 : 1,
                transition: 'opacity 0.375s cubic-bezier(0.4, 0, 0.2, 1)',
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

              <Box sx={{ 
                display: 'flex',
                alignItems: 'center',
                gap: 2,
              }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    whiteSpace: 'nowrap',
                    opacity: isClosing ? 0 : 1,
                    transition: 'opacity 0.375s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                >
                  {formValues.knowledgeSets.length} Ktags
                </Typography>

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
                    opacity: isClosing ? 0 : 1,
                    transition: 'all 0.375s cubic-bezier(0.4, 0, 0.2, 1)',
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
            </Box>
          </Fade>
        )}

        {/* Contenedor de ktags con scroll */}
        <Box 
          ref={scrollContainerRef}
          sx={{ 
            flex: 1,
            position: 'relative',
            p: 1.5,
            overflow: expandedIndex === false ? 'auto' : 'hidden',
            transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
            '&::-webkit-scrollbar': {
              width: '6px',
              backgroundColor: 'transparent',
              transition: 'all 1s cubic-bezier(0.4, 0, 0.2, 1) 150ms',
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: 'transparent',
              margin: '4px 0',
              transition: 'all 1s cubic-bezier(0.4, 0, 0.2, 1) 150ms',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: isClosing ? 'background.paper' : 'primary.main',
              opacity: expandedIndex === false ? (isClosing ? 0 : 0.3) : 0,
              borderRadius: '3px',
              transition: 'all 1s cubic-bezier(0.4, 0, 0.2, 1) 150ms',
              '&:hover': {
                backgroundColor: isClosing ? 'background.paper' : 'primary.dark',
                opacity: expandedIndex === false ? (isClosing ? 0 : 0.5) : 0,
                transition: 'all 1s cubic-bezier(0.4, 0, 0.2, 1) 150ms',
              }
            },
            overflowX: 'hidden',
            msOverflowStyle: expandedIndex === false ? 'auto' : 'none',
            scrollbarWidth: expandedIndex === false ? 'thin' : 'none',
            scrollbarColor: expandedIndex === false ? 
              (isClosing ? 'var(--mui-palette-background-paper) transparent' : 'var(--mui-palette-primary-main) transparent') : 
              'transparent transparent',
            transitionProperty: 'all, scrollbar-color',
            transitionDuration: '1s, 1s',
            transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1), cubic-bezier(0.4, 0, 0.2, 1)',
            transitionDelay: '150ms, 150ms',
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
                          cursor: expandedIndex === index ? 'default' : 'pointer',
                          position: isAnimating && expandedIndex === index ? 'fixed' : 
                            expandedIndex === index ? 'absolute' : 'relative',
                          top: isAnimating && expandedIndex === index ? 
                            `${selectedItemPosition?.top}px` : 
                            expandedIndex === index ? '50%' : 'auto',
                          left: isAnimating && expandedIndex === index ? 
                            `${selectedItemPosition?.left}px` : 
                            expandedIndex === index ? '50%' : 'auto',
                          width: expandedIndex === index ? '100%' : 'auto',
                          height: expandedIndex === index ? '100%' : 'auto',
                          transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                          transform: expandedIndex === index ? 
                            (!isAnimating ? 'translate(-50%, -50%)' : 'none') : 
                            'none',
                          opacity: expandedIndex !== false ? 
                            (expandedIndex === index ? 
                              (isClosing ? 0 : 1) : 
                              (isClosing && expandedIndex === index ? 1 : 0)) : 
                            1,
                          pointerEvents: (expandedIndex !== false && expandedIndex !== index) || isClosing ? 'none' : 'auto',
                          zIndex: expandedIndex === index ? 1000 : 1,
                          '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: '90px',
                            bottom: 0,
                            backgroundColor: 'primary.main',
                            opacity: lastClosedIndex === index ? 0.3 : 0,
                            transition: lastClosedIndex === index ? 
                              'opacity 0.25s cubic-bezier(0.4, 0, 0.2, 1)' : 
                              'opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                            borderRadius: 1,
                            zIndex: 0,
                          },
                          '&:hover': {
                            '&::before': {
                              opacity: expandedIndex === false ? 
                                (lastClosedIndex === index ? 0.3 : 1) : 
                                0,
                            },
                            '& .ktag-title': {
                              color: expandedIndex === false ? 'primary.contrastText' : 'inherit',
                              zIndex: 1,
                            },
                          },
                          ...(expandedIndex === index && {
                            position: 'absolute',
                            left: '50%',
                            top: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '100%',
                            height: '100%',
                            zIndex: 10,
                            margin: '0 !important',
                            boxShadow: 3,
                            backgroundColor: 'background.paper',
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
                          data-header="true"
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            minHeight: '48px',
                            px: 2,
                            position: 'relative',
                            backgroundColor: expandedIndex === index ? 'primary.light' : 'transparent',
                            borderTopLeftRadius: '8px',
                            borderTopRightRadius: '8px',
                            cursor: 'pointer',
                            opacity: isClosing ? 0 : 1,
                            transition: 'opacity 0.3s ease',
                          }}
                        >
                          {expandedIndex === index ? (
                            <Fade in={expandedIndex === index} timeout={1000}>
                              <Box sx={{ 
                                display: 'flex', 
                                alignItems: 'center',
                                width: '100%',
                                gap: 1
                              }}>
                                <Typography 
                                  className="ktag-title"
                                  sx={{ 
                                    fontWeight: 'bold',
                                    fontSize: '0.95rem',
                                    flex: 1,
                                    position: 'relative',
                                    color: 'primary.contrastText',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                  }}
                                >
                                  <Box
                                    component="span"
                                    sx={{
                                      minWidth: '20px',
                                      height: '20px',
                                      borderRadius: '4px',
                                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                      color: 'rgba(255, 255, 255, 0.7)',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      fontSize: '0.7rem',
                                      fontWeight: '500',
                                      marginRight: '8px',
                                      lineHeight: 1,
                                      paddingTop: '1px',
                                    }}
                                  >
                                    {index + 1}
                                  </Box>
                                  {set.knowledge_key || `${t.dataEntry.knowledgeSet || 'Conjunto de conocimiento'} ${index + 1}`}
                                </Typography>
                                
                                <Box sx={{ 
                                  display: 'flex', 
                                  gap: 1,
                                  alignItems: 'center',
                                  position: 'relative',
                                  zIndex: 2,
                                }}>
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
                                      transition: 'all 0.3s ease',
                                      '&:hover': {
                                        backgroundColor: 'success.main',
                                        color: 'success.contrastText',
                                        '& .MuiSvgIcon-root': {
                                          color: 'success.contrastText',
                                        }
                                      },
                                      '& .MuiSvgIcon-root': {
                                        transition: 'color 0.3s ease',
                                        color: 'inherit'
                                      }
                                    }}
                                  >
                                    {savingTagIndex === index ? (
                                      <CircularProgress size={20} sx={{ color: 'success.main' }} />
                                    ) : (
                                      <SaveIcon sx={{ fontSize: 20 }} />
                                    )}
                                  </Button>
                                  <Button
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
                                            setExpandedIndex(false); // Cerramos la tarjeta después de eliminar
                                          })
                                          .catch(() => {
                                            ErrorToast('Error al eliminar el conjunto de conocimiento');
                                          });
                                      } else {
                                        setFormValues(prev => ({
                                          ...prev,
                                          knowledgeSets: prev.knowledgeSets.filter((_, i) => i !== index)
                                        }));
                                        setExpandedIndex(false); // Cerramos la tarjeta después de eliminar
                                      }
                                    }}
                                    sx={{
                                      minWidth: '32px',
                                      width: '32px',
                                      height: '32px',
                                      padding: 0,
                                      borderRadius: '50%',
                                      color: 'error.main',
                                      backgroundColor: 'background.paper',
                                      transition: 'all 0.3s ease',
                                      '&:hover': {
                                        backgroundColor: 'error.main',
                                        color: 'error.contrastText',
                                        '& .MuiSvgIcon-root': {
                                          color: 'error.contrastText',
                                        }
                                      },
                                      '& .MuiSvgIcon-root': {
                                        transition: 'color 0.3s ease',
                                        color: 'inherit'
                                      }
                                    }}
                                  >
                                    <DeleteOutlineIcon sx={{ fontSize: 20 }} />
                                  </Button>
                                  <ExpandMoreIcon 
                                    sx={{ 
                                      transform: 'rotate(180deg)',
                                      color: 'primary.contrastText',
                                    }} 
                                  />
                                </Box>
                              </Box>
                            </Fade>
                          ) : (
                            // Contenido del header cuando no está expandido
                            <>
                              <Typography 
                                className="ktag-title"
                                sx={{ 
                                  fontWeight: 'bold',
                                  fontSize: '0.95rem',
                                  flex: 1,
                                  position: 'relative',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 1,
                                }}
                              >
                                <Box
                                  component="span"
                                  sx={{
                                    minWidth: '20px',
                                    height: '20px',
                                    borderRadius: '4px',
                                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                                    color: 'text.secondary',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '0.7rem',
                                    fontWeight: '500',
                                    marginRight: '8px',
                                    transition: 'all 0.3s ease',
                                    zIndex: 1,
                                    lineHeight: 1,
                                    paddingTop: '1px',
                                  }}
                                >
                                  {index + 1}
                                </Box>
                                {set.knowledge_key || `${t.dataEntry.knowledgeSet || 'Conjunto de conocimiento'} ${index + 1}`}
                              </Typography>
                              
                              <Box sx={{ 
                                display: 'flex', 
                                gap: 1,
                                alignItems: 'center',
                                position: 'relative',
                                zIndex: 2,
                              }}>
                                <Button
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
                                          setExpandedIndex(false); // Cerramos la tarjeta después de eliminar
                                        })
                                        .catch(() => {
                                          ErrorToast('Error al eliminar el conjunto de conocimiento');
                                        });
                                    } else {
                                      setFormValues(prev => ({
                                        ...prev,
                                        knowledgeSets: prev.knowledgeSets.filter((_, i) => i !== index)
                                      }));
                                      setExpandedIndex(false); // Cerramos la tarjeta después de eliminar
                                    }
                                  }}
                                  sx={{
                                    minWidth: '32px',
                                    width: '32px',
                                    height: '32px',
                                    padding: 0,
                                    borderRadius: '50%',
                                    color: 'error.main',
                                    backgroundColor: 'transparent',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                      backgroundColor: 'error.main',
                                      color: 'error.contrastText',
                                      '& .MuiSvgIcon-root': {
                                        color: 'error.contrastText',
                                      }
                                    },
                                    '& .MuiSvgIcon-root': {
                                      transition: 'color 0.3s ease',
                                      color: 'inherit'
                                    }
                                  }}
                                >
                                  <DeleteOutlineIcon sx={{ fontSize: 20 }} />
                                </Button>
                                <ExpandMoreIcon 
                                  sx={{ 
                                    color: 'text.secondary',
                                  }} 
                                />
                              </Box>
                            </>
                          )}
                        </Box>

                        {/* Contenido */}
                        {expandedIndex === index && (
                          <Fade 
                            in={expandedIndex === index && !isClosing}
                            timeout={{ 
                              enter: 750,
                              exit: 375
                            }}
                            style={{ 
                              transitionDelay: isClosing ? '0ms' : '300ms',
                              transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)'
                            }}
                          >
                            <Box 
                              sx={{ 
                                p: 3,
                                flex: 1,
                                display: 'flex',
                                flexDirection: 'column',
                                minHeight: '640px',
                                height: '100%',
                                transition: 'opacity 0.375s cubic-bezier(0.4, 0, 0.2, 1)',
                                transform: 'none',
                                opacity: isClosing ? 0 : 1,
                                '& .MuiTextField-root': {
                                  transition: 'opacity 0.375s cubic-bezier(0.4, 0, 0.2, 1)',
                                  opacity: isClosing ? 0 : 1,
                                },
                                '@keyframes fadeIn': {
                                  from: { 
                                    opacity: 0,
                                  },
                                  to: { 
                                    opacity: 1,
                                  }
                                },
                                animation: 'fadeIn 0.375s cubic-bezier(0.4, 0, 0.2, 1) 0.3s forwards',
                              }}
                            >
                              <Box sx={{ 
                                display: 'flex', 
                                flexDirection: 'column', 
                                gap: 2,
                                height: '100%',
                                opacity: isClosing ? 0 : 1,
                                transition: 'opacity 0.375s cubic-bezier(0.4, 0, 0.2, 1)',
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
            transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
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
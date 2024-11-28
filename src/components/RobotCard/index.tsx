import React, { useEffect, useRef, useState } from 'react';
import './styles.css';
import { IconButton, Tooltip, Typography, Menu, MenuItem, CircularProgress } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import WidgetsIcon from '@mui/icons-material/Widgets';
import ApiIcon from '@mui/icons-material/Api';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import BuildIcon from '@mui/icons-material/Build';
import PaletteIcon from '@mui/icons-material/Palette';
import { TranslationType } from '@/utils/Traslations/types';
import { useAppContext } from '@/context';
import useProfile from '@/hooks/apps/accounts/useProfile';
import { ApiKey } from '@/types/UserProfile';
import { toast } from 'react-toastify';
import useApiKeys from "@/hooks/apps/accounts/useApiKeys";
import { useNavigate } from 'react-router-dom';

interface RobotCardProps {
  name: string;
  lastUpdate: string;
  agentId: string;
  description?: string;
  onTest?: () => void;
  onWidget: () => void;
  onApi: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onCustomize: () => void;
  onTools: () => void;
  onChat: () => void;
  onKnowledge: () => void;
  t: TranslationType['robotCard'];
  language?: string;
  status?: 'online' | 'offline' | 'busy' | 'error' | 'updating';
  selectedApiKey?: string | null;
  modelAi?: string;
  onConfigureLLM?: (apiKeyId: number) => void;
}

const RobotCard: React.FC<RobotCardProps> = ({
  name,
  agentId,
  onWidget,
  onApi,
  onEdit,
  onDelete,
  onCustomize,
  onTools,
  onChat,
  onKnowledge,
  t,
  status,
  selectedApiKey,
  modelAi,
  onConfigureLLM
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const eyesRef = useRef<HTMLDivElement>(null);
  const { getApiKeys } = useApiKeys();
  const [showBubble, setShowBubble] = useState(false);
  const [displayText, setDisplayText] = useState('');
  const bubbleTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const streamTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const { showRobotCardHelp } = useAppContext();
  const [isTalking, setIsTalking] = useState(false);
  const [isGlowing, setIsGlowing] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const { setBotApiKey, updateBotApiKey } = useProfile();
  const [isLoadingKeys, setIsLoadingKeys] = useState(false);
  const [hasLoadedKeys, setHasLoadedKeys] = useState(false);
  const [isUpdatingApiKey, setIsUpdatingApiKey] = useState(false);

  // Función para obtener el estado traducido
  const getStatusText = () => {
    if (!status) return t?.defaultStatus || 'Agent working normally';
    
    const statusMap: Record<string, string | undefined> = {
      online: t?.statusOnline,
      offline: t?.statusOffline,
      busy: t?.statusBusy,
      error: t?.statusError,
      updating: t?.statusUpdating
    };
    
    return statusMap[status] || t?.defaultStatus || 'Agent working normally';
  };

  // Función para obtener el color del estado
  const getStatusColor = () => {
    if (!status) return 'text.primary';
    
    const colorMap: Record<string, string> = {
      online: 'success.main',
      offline: 'text.disabled',
      busy: 'warning.main',
      error: 'error.main',
      updating: 'info.main'
    };
    
    return colorMap[status] || 'text.primary';
  };

  // Función para obtener un saludo aleatorio
  const getRandomGreeting = () => {
    const greetings = t?.greetings || [
      "Hello! How are you?",
      "Welcome! How can I help you?",
      "Greetings! How's your day going?",
      "Nice to see you! How are you doing?"
    ];
    return greetings[Math.floor(Math.random() * greetings.length)];
  };

  useEffect(() => {
    const card = cardRef.current;
    const eyes = eyesRef.current;
    if (!card || !eyes) return;

    const handleMouseMove = (e: MouseEvent) => {
      const cardRect = card.getBoundingClientRect();
      const cardCenterX = cardRect.left + cardRect.width / 2;
      const cardCenterY = cardRect.top + cardRect.height / 2;
      
      const angle = Math.atan2(e.clientY - cardCenterY, e.clientX - cardCenterX);
      
      const radius = 3;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;

      const pupils = eyes.getElementsByClassName('eye');
      Array.from(pupils).forEach(pupil => {
        const afterElement = (pupil as HTMLElement);
        afterElement.style.setProperty('--pupil-x', `${x}px`);
        afterElement.style.setProperty('--pupil-y', `${y}px`);
      });
    };

    const handleMouseLeave = () => {
      const pupils = eyes.getElementsByClassName('eye');
      Array.from(pupils).forEach(pupil => {
        const afterElement = (pupil as HTMLElement);
        afterElement.style.setProperty('--pupil-x', '0px');
        afterElement.style.setProperty('--pupil-y', '0px');
      });
    };

    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const streamText = (text: string) => {
    let index = 0;
    setDisplayText('');
    setIsTalking(true);
    
    const stream = () => {
      if (index <= text.length) {
        setDisplayText(text.slice(0, index));
        index++;
        streamTimeoutRef.current = setTimeout(stream, 30);
      } else {
        setIsTalking(false);
      }
    };
    
    stream();
  };

  const handleButtonHover = (buttonType: 'widget' | 'customization' | 'api' | 'tools' | 'edit' | 'test' | 'delete' | 'knowledge') => {
    if (!showRobotCardHelp) return;
    
    if (bubbleTimeoutRef.current) {
      clearTimeout(bubbleTimeoutRef.current);
    }
    if (streamTimeoutRef.current) {
      clearTimeout(streamTimeoutRef.current);
    }

    const helpText = t?.helpTexts?.[buttonType];
    setShowBubble(true);
    streamText(helpText);
  };

  const handleButtonLeave = () => {
    if (!showRobotCardHelp) return;
    
    bubbleTimeoutRef.current = setTimeout(() => {
      setShowBubble(false);
      setIsTalking(false);
      if (streamTimeoutRef.current) {
        clearTimeout(streamTimeoutRef.current);
      }
    }, 300);
  };

  const handleFaceClick = () => {
    if (bubbleTimeoutRef.current) {
      clearTimeout(bubbleTimeoutRef.current);
    }
    if (streamTimeoutRef.current) {
      clearTimeout(streamTimeoutRef.current);
    }

    const randomGreeting = getRandomGreeting();
    setShowBubble(true);
    streamText(randomGreeting);

    bubbleTimeoutRef.current = setTimeout(() => {
      setShowBubble(false);
    }, 2000);
  };

  useEffect(() => {
    return () => {
      if (bubbleTimeoutRef.current) {
        clearTimeout(bubbleTimeoutRef.current);
      }
      if (streamTimeoutRef.current) {
        clearTimeout(streamTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!selectedApiKey) {
      const interval = setInterval(() => {
        setIsGlowing(prev => !prev);
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [selectedApiKey]);

  // Función para cargar las API keys
  const loadApiKeys = async () => {
    if (hasLoadedKeys) return;
    
    setIsLoadingKeys(true);
    try {
      const response = await getApiKeys();
      
      if (response?.data) {
        setApiKeys(response.data);
      } else {
        console.error('No se pudieron cargar las API keys:', response);
      }
    } catch (error) {
      console.error('Error al cargar las API keys:', error);
      toast.error(t?.errorLoadingApiKeys || 'Error al cargar las API keys', {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setIsLoadingKeys(false);
      setHasLoadedKeys(true);
    }
  };

  const handleClick = async (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    // Primero abrimos el menú
    setAnchorEl(event.currentTarget);
    
    // Luego cargamos las API keys si no se han cargado
    if (!hasLoadedKeys) {
      await loadApiKeys();
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelectApiKey = async (apiKey: ApiKey | null) => {
    setIsUpdatingApiKey(true);
    try {
      if (!agentId) {
        throw new Error('ID de bot inválido');
      }

      let response;
      if (apiKey === null) {
        response = await updateBotApiKey(agentId);
      } else {
        if (selectedApiKey) {
          response = await updateBotApiKey(agentId, apiKey.id);
        } else {
          response = await setBotApiKey(agentId, apiKey.id);
        }
      }
      
      if (response.success) {
        toast.success('API key actualizada correctamente', {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        
        if (onConfigureLLM && apiKey !== null) {
          onConfigureLLM(apiKey.id);
        }
      } else {
        toast.error(response.message || 'Error al actualizar la API key', {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (error) {
      console.error('Error al actualizar API key:', error);
      toast.error('Error al actualizar la API key del bot', {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setIsUpdatingApiKey(false);
      handleClose();
    }
  };

/*   const handleTestClick = () => {
    navigate(`/builder/agents/chat/${botId}`);
  }; */

  return (
    <div className="robot-card" ref={cardRef} style={{
      width: '100%',
      minWidth: '300px',
      maxWidth: '460px',
      margin: '0 auto'
    }}>
      <div className="robot-actions">
        {/* Sección de actualizaciones - volvemos al estado original */}
        <div className="action-row top">
          <div className="update-info">
            <Typography 
              variant="caption" 
              className="update-text"
              sx={{ color: getStatusColor() }}
            >
              {getStatusText()}
            </Typography>
          </div>
        </div>

        {/* Resto del código sin cambios... */}
        <div className="action-column left">
          <Tooltip title={t?.knowledge || "Conocimiento"} placement="left">
            <IconButton 
              className="action-button" 
              onClick={onKnowledge}
              onMouseEnter={() => handleButtonHover('knowledge')}
              onMouseLeave={handleButtonLeave}
            >
              <MenuBookIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title={t?.customization || "Customization"} placement="left">
            <IconButton 
              className="action-button" 
              onClick={onCustomize}
              onMouseEnter={() => handleButtonHover('customization')}
              onMouseLeave={handleButtonLeave}
            >
              <PaletteIcon />
            </IconButton>
          </Tooltip>
        </div>

        <div className="robot">
          <div className="robot-head">
            <div className="antenna"></div>
            <div className="face" onClick={handleFaceClick}>
              {showBubble && <div className="speech-bubble">{displayText}</div>}
              <div className="eyes" ref={eyesRef}>
                <div className="eye"></div>
                <div className="eye"></div>
              </div>
              <div className={`mouth ${isTalking ? 'talking' : ''}`}></div>
            </div>
          </div>
        </div>

        <div className="action-column right">
          <Tooltip title={t?.useAPI || "Use API"} placement="right">
            <IconButton 
              className="action-button" 
              onClick={onApi}
              onMouseEnter={() => handleButtonHover('api')}
              onMouseLeave={handleButtonLeave}
            >
              <ApiIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title={t?.tools || "Tools"} placement="right">
            <IconButton 
              className="action-button" 
              onClick={onTools}
              onMouseEnter={() => handleButtonHover('tools')}
              onMouseLeave={handleButtonLeave}
            >
              <BuildIcon />
            </IconButton>
          </Tooltip>
        </div>

        <div className="action-row bottom">
          <Tooltip title={t?.edit || "Edit"}>
            <IconButton 
              className="action-button" 
              onClick={onEdit}
              onMouseEnter={() => handleButtonHover('edit')}
              onMouseLeave={handleButtonLeave}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title={t?.testAgent || "Test Agent"}>
            <IconButton 
              className="action-button test" 
              onClick={onChat}
              onMouseEnter={() => handleButtonHover('test')}
              onMouseLeave={handleButtonLeave}
              sx={{ backgroundColor: 'primary.main', color: 'white', '&:hover': { backgroundColor: 'primary.dark' } }}
            >
              <PlayArrowIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title={t?.delete || "Delete"}>
            <IconButton 
              className="action-button delete" 
              onClick={onDelete}
              onMouseEnter={() => handleButtonHover('delete')}
              onMouseLeave={handleButtonLeave}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </div>
      </div>

      {name && <h3 className="robot-name">{name}</h3>}
      
      {/* Footer modificado para mostrar el modelo seleccionado o el botón de configuración */}
      <div style={{ 
        marginTop: '8px',
        textAlign: 'center',
        padding: '4px'
      }}>
        <div
          onClick={!isUpdatingApiKey ? handleClick : undefined}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: isGlowing ? 'rgba(25, 118, 210, 0.12)' : 'rgba(25, 118, 210, 0.08)',
            color: 'white',
            padding: '4px 12px',
            borderRadius: '16px',
            fontSize: '0.75rem',
            cursor: isUpdatingApiKey ? 'default' : 'pointer',
            transition: 'all 0.8s ease',
            userSelect: 'none',
            border: `1px solid ${isGlowing ? 'rgba(25, 118, 210, 0.5)' : 'rgba(25, 118, 210, 0.2)'}`,
            boxShadow: isGlowing ? '0 0 8px rgba(25, 118, 210, 0.3)' : 'none',
            background: isGlowing ? 'linear-gradient(90deg, #1976d2 0%, #2196f3 100%)' : 'linear-gradient(90deg, #1565c0 0%, #1976d2 100%)',
            opacity: isUpdatingApiKey ? 0.7 : 1,
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = 'linear-gradient(90deg, #1565c0 0%, #1976d2 100%)';
            e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.3)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = isGlowing 
              ? 'linear-gradient(90deg, #1976d2 0%, #2196f3 100%)'
              : 'linear-gradient(90deg, #1565c0 0%, #1976d2 100%)';
            e.currentTarget.style.border = `1px solid ${isGlowing ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.2)'}`;
          }}
        >
          {isUpdatingApiKey ? (
            <CircularProgress size={16} sx={{ color: 'white', mr: 1 }} />
          ) : null}
          {selectedApiKey 
            ? (modelAi && modelAi.length > 15 
                ? `${modelAi.substring(0, 15)}...` 
                : modelAi || 'LLM Configurado')
            : (t?.configLLM || "Configurar LLM")
          }
        </div>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              minWidth: '200px',
              '& .MuiMenuItem-root': {
                px: 2,
                py: 1,
              },
              '&:before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          {isLoadingKeys ? (
            <MenuItem sx={{ justifyContent: 'center', py: 2 }}>
              <CircularProgress 
                size={20}
                sx={{ color: 'primary.main' }}
              />
            </MenuItem>
          ) : apiKeys && apiKeys.length > 0 ? (
            apiKeys.map((apiKey) => (
              <MenuItem 
                key={apiKey.id} 
                onClick={() => handleSelectApiKey(apiKey)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  }
                }}
              >
                <Typography variant="body2" sx={{ flex: 1 }}>
                  {apiKey.api_name}
                </Typography>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: 'text.secondary',
                    backgroundColor: 'action.selected',
                    px: 1,
                    py: 0.5,
                    borderRadius: 1,
                    textTransform: 'uppercase',
                    fontSize: '0.65rem'
                  }}
                >
                  {apiKey.api_type}
                </Typography>
              </MenuItem>
            ))
          ) : (
            <MenuItem 
              onClick={handleClose}
              sx={{ 
                justifyContent: 'center',
                color: 'text.secondary',
                py: 2
              }}
            >
              <Typography variant="body2">
                {t?.emptyApiKeys || "No hay API keys configuradas"}
              </Typography>
            </MenuItem>
          )}
        </Menu>
      </div>
    </div>
  );
};

export default RobotCard;

import React, { useEffect, useRef, useState } from 'react';
import './styles.css';
import { IconButton, Tooltip, Typography } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import WidgetsIcon from '@mui/icons-material/Widgets';
import ApiIcon from '@mui/icons-material/Api';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import BuildIcon from '@mui/icons-material/Build';
import { TranslationType } from '@/utils/Traslations/types';
import { useAppContext } from '@/context';

interface RobotCardProps {
  name: string;
  description: string;
  lastUpdate: string;
  botId: string;
  onTest?: () => void;
  onWidget: () => void;
  onApi: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onCustomize: () => void;
  onTools: () => void;
  onChat: () => void;
  t: TranslationType['robotCard'];
  language?: string;
  status?: 'online' | 'offline' | 'busy' | 'error' | 'updating';
}

const RobotCard: React.FC<RobotCardProps> = ({
  name,
  description,
  onWidget,
  onApi,
  onEdit,
  onDelete,
  onCustomize,
  onTools,
  onChat,
  t,
  status
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const eyesRef = useRef<HTMLDivElement>(null);
  const [showBubble, setShowBubble] = useState(false);
  const [displayText, setDisplayText] = useState('');
  const bubbleTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const streamTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const { showRobotCardHelp } = useAppContext();
  const [isTalking, setIsTalking] = useState(false);

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

  const handleButtonHover = (buttonType: 'widget' | 'customization' | 'api' | 'tools' | 'edit' | 'test' | 'delete') => {
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

/*   const handleTestClick = () => {
    navigate(`/builder/agents/chat/${botId}`);
  }; */

  return (
    <div className="robot-card" ref={cardRef} style={{
      width: '100%',         // Ocupar todo el ancho disponible del contenedor
      minWidth: '300px',     // Ancho mínimo aumentado
      maxWidth: '460px',     // Ancho máximo aumentado
      margin: '0 auto'       // Centrar la tarjeta en su contenedor
    }}>
      <div className="robot-actions">
        {/* Sección de actualizaciones */}
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
          <Tooltip title={t?.widget || "Widget"} placement="left">
            <IconButton 
              className="action-button" 
              onClick={onWidget}
              onMouseEnter={() => handleButtonHover('widget')}
              onMouseLeave={handleButtonLeave}
            >
              <WidgetsIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title={t?.customization || "Customization"} placement="left">
            <IconButton 
              className="action-button" 
              onClick={onCustomize}
              onMouseEnter={() => handleButtonHover('customization')}
              onMouseLeave={handleButtonLeave}
            >
              <MenuBookIcon />
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
      {description && <p className="robot-description">{description}</p>}
    </div>
  );
};

export default RobotCard;

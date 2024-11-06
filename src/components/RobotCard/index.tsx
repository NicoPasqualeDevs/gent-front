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

interface RobotCardProps {
  name: string;
  description: string;
  lastUpdate: string;
  onTest: () => void;
  onWidget: () => void;
  onApi: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onCustomize: () => void;
  onTools: () => void;
  t: TranslationType['robotCard'];
  language?: string;
  status?: 'online' | 'offline' | 'busy' | 'error' | 'updating';
}

const RobotCard: React.FC<RobotCardProps> = ({
  name,
  description,
  onTest,
  onWidget,
  onApi,
  onEdit,
  onDelete,
  onCustomize,
  onTools,
  t,
  status
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const eyesRef = useRef<HTMLDivElement>(null);
  const [showBubble, setShowBubble] = useState(false);
  const [greeting, setGreeting] = useState('');
  const bubbleTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

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

  const handleFaceClick = () => {
    if (bubbleTimeoutRef.current) {
      clearTimeout(bubbleTimeoutRef.current);
    }

    setGreeting(getRandomGreeting());
    setShowBubble(true);

    bubbleTimeoutRef.current = setTimeout(() => {
      setShowBubble(false);
    }, 2000);
  };

  useEffect(() => {
    return () => {
      if (bubbleTimeoutRef.current) {
        clearTimeout(bubbleTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="robot-card" ref={cardRef}>
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
          <Tooltip title={t?.widget || "Widget"}>
            <IconButton className="action-button" onClick={onWidget}>
              <WidgetsIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title={t?.customization || "Customization"}>
            <IconButton className="action-button" onClick={onCustomize}>
              <MenuBookIcon />
            </IconButton>
          </Tooltip>
        </div>

        <div className="robot">
          <div className="robot-head">
            <div className="antenna"></div>
            <div className="face" onClick={handleFaceClick}>
              {showBubble && <div className="speech-bubble">{greeting}</div>}
              <div className="eyes" ref={eyesRef}>
                <div className="eye"></div>
                <div className="eye"></div>
              </div>
              <div className="mouth"></div>
            </div>
          </div>
        </div>

        <div className="action-column right">
          <Tooltip title={t?.useAPI || "Use API"}>
            <IconButton className="action-button" onClick={onApi}>
              <ApiIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title={t?.tools || "Tools"}>
            <IconButton className="action-button" onClick={onTools}>
              <BuildIcon />
            </IconButton>
          </Tooltip>
        </div>

        <div className="action-row bottom">
          <Tooltip title={t?.edit || "Edit"}>
            <IconButton className="action-button" onClick={onEdit}>
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title={t?.testAgent || "Test Agent"}>
            <IconButton 
              className="action-button test" 
              onClick={onTest}
              sx={{ backgroundColor: 'primary.main', color: 'white', '&:hover': { backgroundColor: 'primary.dark' } }}
            >
              <PlayArrowIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title={t?.delete || "Delete"}>
            <IconButton className="action-button delete" onClick={onDelete}>
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

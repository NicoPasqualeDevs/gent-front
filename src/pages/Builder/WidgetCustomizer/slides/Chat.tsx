import React from 'react';
import { Box } from '@mui/material';
import RobotIcon from '@mui/icons-material/SmartToy';

interface ChatProps {
  primaryColor: string;
  primaryTextContrast: string;
  secondaryColor: string;
  secondaryTextContrast: string;
  icon_agent: string;
}

interface Message {
  role: 'agent' | 'client';
  content: string;
}

export const Chat: React.FC<ChatProps> = ({
  primaryColor,
  primaryTextContrast,
  secondaryColor,
  secondaryTextContrast,
  icon_agent
}) => {
  // Mensajes de ejemplo actualizados para la vista previa
  const sampleMessages: Message[] = [
    {
      role: 'agent',
      content: 'Hola 👋 ¿En qué puedo ayudarte?'
    },
    {
      role: 'client',
      content: '¿Cuáles son sus horarios de atención?'
    },
    {
      role: 'agent',
      content: 'Nuestro horario de atención es de lunes a viernes de 9:00 AM a 6:00 PM'
    },
    {
      role: 'client',
      content: '¿Tienen servicio los fines de semana?'
    },
    {
      role: 'agent',
      content: 'Por el momento no ofrecemos atención en fines de semana, pero puedes dejar tu mensaje y te responderemos el siguiente día hábil.'
    },
    {
      role: 'client',
      content: '¿Cuál es su correo de contacto?'
    },
    {
      role: 'agent',
      content: 'Puedes escribirnos a **soporte@empresa.com** o visitar nuestra página web https://www.empresa.com/contacto'
    },
    {
      role: 'client',
      content: '¿Tienen oficina física?'
    },
    {
      role: 'agent',
      content: 'Sí, nuestra oficina principal está ubicada en Av. Principal 123, Edificio Central, Piso 4.'
    },
    {
      role: 'client',
      content: 'Gracias por la información'
    },
    {
      role: 'agent',
      content: '¡Con gusto! Si tienes más preguntas, no dudes en consultarme. 😊'
    }
  ];

  const transformTextToStrong = (text: string) => {
    return text.replace(/\*\*(.*?)\*\*/g, '<span style="font-weight: bold;">$1</span>');
  };

  const transformTextToLink = (text: string) => {
    const linkRegex = /(https?:\/\/[^\s]+)/g;
    const emailRegex = /\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\b/g;

    return text
      .replace(linkRegex, `<a href="$1" target="_blank" style="color: ${secondaryColor}">$1</a>`)
      .replace(emailRegex, `<a href="mailto:$1" style="color: ${secondaryColor}">$1</a>`);
  };

  return (
    <Box
      sx={{
        height: '80%',
        overflowY: 'auto',
        p: 2,
        '&::-webkit-scrollbar': {
          width: '6px'
        },
        '&::-webkit-scrollbar-track': {
          background: 'transparent'
        },
        '&::-webkit-scrollbar-thumb': {
          background: primaryColor,
          borderRadius: '3px'
        }
      }}
    >
      {sampleMessages.map((message, index) => (
        <Box
          key={index}
          sx={{
            display: 'flex',
            justifyContent: message.role === 'agent' ? 'flex-start' : 'flex-end',
            mb: 2
          }}
        >
          {message.role === 'agent' && (
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                backgroundColor: primaryColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 1
              }}
            >
              {icon_agent ? (
                <img 
                  src={icon_agent} 
                  alt="Agent Icon" 
                  style={{ 
                    maxWidth: '80%', 
                    maxHeight: '80%' 
                  }} 
                />
              ) : (
                <RobotIcon sx={{ color: primaryTextContrast }} />
              )}
            </Box>
          )}
          
          <Box
            sx={{
              maxWidth: '70%',
              p: 1.5,
              borderRadius: message.role === 'agent' 
                ? '10px 10px 10px 0'
                : '10px 0 10px 10px',
              backgroundColor: message.role === 'agent' ? primaryColor : secondaryColor,
              color: message.role === 'agent' ? primaryTextContrast : secondaryTextContrast
            }}
            dangerouslySetInnerHTML={{
              __html: transformTextToStrong(transformTextToLink(message.content))
            }}
          />
        </Box>
      ))}
    </Box>
  );
}; 
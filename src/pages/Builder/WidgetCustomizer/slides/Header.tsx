import React from 'react';
import { Box, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface HeaderProps {
  chatState: boolean;
  brandLogo: string;
  brandAlt: string;
  onBack: () => void;
  primaryColor: string;
  primaryTextContrast: string;
}

export const Header: React.FC<HeaderProps> = ({
  chatState,
  brandLogo,
  brandAlt,
  onBack,
  primaryColor,
  primaryTextContrast
}) => {
  return (
    <Box
      sx={{
        height: chatState ? '10%' : '40%',
        backgroundColor: primaryColor,
        color: primaryTextContrast,
        transition: 'height 0.5s',
        display: 'flex',
        flexDirection: 'column',
        padding: 2
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <img 
            src={brandLogo} 
            alt={brandAlt}
            style={{ 
              height: chatState ? '30px' : '40px',
              transition: 'height 0.5s'
            }}
          />
        </Box>
        {chatState && (
          <CloseIcon 
            sx={{ cursor: 'pointer' }}
            onClick={onBack}
          />
        )}
      </Box>
      
      {!chatState && (
        <Typography 
          variant="h6" 
          sx={{ 
            mt: 2,
            opacity: chatState ? 0 : 1,
            transition: 'opacity 0.5s'
          }}
        >
          Hola 👋
          <br />
          ¿Cómo podemos ayudarte?
        </Typography>
      )}
    </Box>
  );
}; 
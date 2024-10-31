import React, { useState } from 'react';
import { Box, TextField, IconButton } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

interface ChatActionProps {
  iconSend: string;
  primaryColor: string;
  secondaryColor: string;
}

export const ChatAction: React.FC<ChatActionProps> = ({
  iconSend,
  primaryColor,
  secondaryColor
}) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      // En la vista previa solo limpiamos el input
      setMessage('');
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        height: '10%',
        borderTop: `1px solid ${primaryColor}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2
      }}
    >
      <TextField
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Ingrese su mensaje..."
        fullWidth
        variant="outlined"
        size="small"
        sx={{
          mr: 1,
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: 'grey.400',
            },
            '&:hover fieldset': {
              borderColor: primaryColor,
            },
            '&.Mui-focused fieldset': {
              borderColor: primaryColor,
            },
          },
        }}
      />
      
      <IconButton 
        type="submit"
        sx={{
          color: primaryColor,
          '&:hover': {
            color: secondaryColor
          }
        }}
      >
        {iconSend ? (
          <img 
            src={iconSend} 
            alt="Send Icon" 
            style={{ 
              width: '24px',
              height: '24px'
            }} 
          />
        ) : (
          <SendIcon />
        )}
      </IconButton>
    </Box>
  );
}; 
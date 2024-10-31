import React from 'react';
import { Box, Button, Typography } from '@mui/material';

interface CoverProps {
  onStartChat: () => void;
  faqQuestions: string[];
  primaryColor: string;
}

export const Cover: React.FC<CoverProps> = ({
  onStartChat,
  faqQuestions,
  primaryColor
}) => {
  return (
    <Box sx={{ p: 2, height: '60%', display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Button
        variant="outlined"
        onClick={onStartChat}
        sx={{
          color: primaryColor,
          borderColor: primaryColor,
          '&:hover': {
            borderColor: primaryColor,
            backgroundColor: 'rgba(0,0,0,0.04)'
          }
        }}
      >
        Envíanos un mensaje
      </Button>

      <Box sx={{ mt: 2 }}>
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          Preguntas frecuentes:
        </Typography>
        {faqQuestions.map((question, index) => (
          <Typography
            key={index}
            variant="body2"
            sx={{
              cursor: 'pointer',
              p: 1,
              '&:hover': {
                backgroundColor: 'rgba(0,0,0,0.04)'
              },
              color: primaryColor
            }}
            onClick={onStartChat}
          >
            {question}
          </Typography>
        ))}
      </Box>
    </Box>
  );
}; 
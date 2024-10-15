import React from 'react';
import { Box, Typography } from '@mui/material';
import theme from "@/styles/theme";

const RightMenu: React.FC = () => {
  return (
    <Box
      sx={{
        width: 120,
        flexShrink: 0,
        backgroundColor: theme.palette.background.paper,
        p: 2,
        overflowY: 'auto',
        height: 'calc(100%)', // Ajustamos la altura para que coincida con UserPanel
        position: 'fixed',
        right: 0,
      }}
    >
      <Typography variant="h6" gutterBottom>
        Sugerencias
      </Typography>
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle2">Agente IA</Typography>
        <Typography variant="body2">Prueba nuestro nuevo agente de marketing</Typography>
      </Box>
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle2">Categoría</Typography>
        <Typography variant="body2">Explora la categoría de Tecnología</Typography>
      </Box>
    </Box>
  );
};

export default RightMenu;

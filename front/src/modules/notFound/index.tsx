import React from 'react';
import { Grid, Typography } from '@mui/material';

const NotFoundModule: React.FC = () => {
  return (
    <Grid container direction="column" alignItems="center" justifyContent="center" style={{ minHeight: '100vh' }}>
      <Typography variant="h2" gutterBottom>
        404 - Página no encontrada
      </Typography>
      <Typography variant="body1">
        Lo sentimos, la página que estás buscando no existe.
      </Typography>
    </Grid>
  );
};

export default NotFoundModule;
import React, { useEffect, useState } from 'react';
import { Grid, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const NotFoundModule: React.FC = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prevCount) => prevCount - 1);
    }, 1000);

    const redirectTimer = setTimeout(() => {
      navigate(-1);
    }, 5000);

    return () => {
      clearInterval(timer);
      clearTimeout(redirectTimer);
    };
  }, [navigate]);

  return (
    <Grid container direction="column" alignItems="center" justifyContent="center" style={{ minHeight: '100vh' }}>
      <Typography variant="h2" gutterBottom>
        404 - Página no encontrada
      </Typography>
      <Typography variant="body1" gutterBottom>
        Lo sentimos, la página que estás buscando no existe.
      </Typography>
      <Typography variant="body2">
        Serás redirigido a la página anterior en {countdown} segundos.
      </Typography>
    </Grid>
  );
};

export default NotFoundModule;
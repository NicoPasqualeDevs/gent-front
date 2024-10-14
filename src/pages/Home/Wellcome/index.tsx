import React, { useState, useEffect } from "react";
import { Grid, Typography, Paper, Button, Box } from "@mui/material";
import theme from "@/styles/theme";

interface WellcomeContainerProps {
  onStartClick: () => void;
}

const WellcomeContainer: React.FC<WellcomeContainerProps> = ({ onStartClick }) => {
  const [userName, setUserName] = useState<string>("");

  const getRandomName = (): string => {
    const names = ["María", "Juan", "Carlos"];
    return names[Math.floor(Math.random() * names.length)];
  };

  const [isGlowing, setIsGlowing] = useState<boolean>(false);

  useEffect(() => {
    setUserName(getRandomName());
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsGlowing(true);
      setTimeout(() => setIsGlowing(false), 500);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Grid container sx={{justifyContent:"center", mt: 7}}>
      <Grid item xs={12} md={10} lg={8}>
        <Paper
          elevation={3}
          sx={{
            padding: "5%",
            borderRadius: "15px",
            backgroundColor: theme.palette.background.paper,
            border: `2px solid ${theme.palette.primary.main}`,
          }}
        >
          <Typography
            variant="h3"
            color={theme.palette.primary.main}
            gutterBottom
            sx={{ borderBottom: `2px solid ${theme.palette.primary.main}`, paddingBottom: 2 }}
          >
            Hola, {userName}
          </Typography>

          <Box sx={{ marginY: 4 }}>
            <Typography variant="h5" color={theme.palette.secondary.main} gutterBottom>
              Bienvenido/a a Gents
            </Typography>
            <Typography variant="body1" paragraph>
              Nuestra novedosa comunidad de emprendedores, enfocada en crear una red de personas o empresas para publicar y consumir herramientas y sistemas basados en inteligencia artificial.
            </Typography>
          </Box>

          <Box sx={{ marginY: 4 }}>
            <Typography variant="h6" color={theme.palette.secondary.main} gutterBottom>
              ¿Qué es Gents?
            </Typography>
            <Typography variant="body1" paragraph>
              Es una comunidad donde podras Contratar, Construir, Importar y Publicar, agentes y sistemas de inteligencia artificial de manera rapida y sencilla.
            </Typography>
          </Box>

          <Box sx={{ marginY: 4 }}>
            <Typography variant="h6" color={theme.palette.secondary.main} gutterBottom>
              Beneficios
            </Typography>
            <Typography variant="body1" component="ul" sx={{ paddingLeft: 2 }}>
              <li>Fácil acceso</li>
              <li>Rápida implementación</li>
              <li>Procesamiento eficiente de datos</li>
              <li>Crea tu contrato</li>
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
            <Button variant="outlined" color="secondary">
              Más información
            </Button>
            <Button
              variant="contained"
              color="primary"
              className={isGlowing ? 'glow-effect' : ''}
              onClick={() => onStartClick()}
              sx={{
                '@keyframes glow': {
                  '0%': { boxShadow: `0 0 5px ${theme.palette.primary.main}` },
                  '50%': { boxShadow: `0 0 20px ${theme.palette.primary.main}` },
                  '100%': { boxShadow: `0 0 5px ${theme.palette.primary.main}` },
                },
                '&.glow-effect': {
                  animation: 'glow 0.5s ease-in-out',
                },
              }}
            >
              Comenzar ahora
            </Button>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default WellcomeContainer;

import React, { useState, useEffect } from "react";
import { Box, Button, Typography, Card, CardContent, Avatar, Grid, Divider, Chip } from "@mui/material";
import { styled } from "@mui/material/styles";
import EmailIcon from "@mui/icons-material/Email";
import WorkIcon from "@mui/icons-material/Work";
import { useNavigate } from 'react-router-dom';

interface ProfileData {
  name: string;
  email: string;
  role: string;
  bio: string;
}

const StyledCard = styled(Card)(({ theme }) => ({
  maxWidth: 800,
  margin: 'auto',
  marginTop: theme.spacing(4),
  background: theme.palette.background.paper,
  color: theme.palette.text.primary,
  boxShadow: 'none',
  border: `2px solid ${theme.palette.primary.main}`,
  borderRadius: theme.shape.borderRadius * 2,
  position: 'relative',
  overflow: 'visible',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: -1,
    left: -1,
    right: -1,
    bottom: -1,
    background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
    borderRadius: 'inherit',
    zIndex: -1,
  },
}));

const ProfileView: React.FC = () => {
  const [loaded, setLoaded] = useState(false);
  const [values, setValues] = useState<ProfileData>({
    name: "",
    email: "",
    role: "",
    bio: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Aquí irá la lógica para cargar los datos del perfil desde la API
    // Por ahora, simularemos una carga con datos de ejemplo
    setTimeout(() => {
      setValues({
        name: "Usuario Ejemplo",
        email: "usuario@ejemplo.com",
        role: "Usuario",
        bio: "Esta es una biografía de ejemplo.",
      });
      setLoaded(true);
    }, 1000);
  }, []);

  return (
    <Box width="100%">
      {!loaded ? (
        <Typography>Cargando...</Typography>
      ) : (
        <>
          <StyledCard>
            <CardContent sx={{ padding: 4 }}>
              <Grid container spacing={3} alignItems="center">
                <Grid item xs={12} md={4}>
                  <Avatar
                    alt={values.name}
                    src="/ruta/a/tu/imagen/de/perfil.jpg"
                    sx={{ 
                      width: 150, 
                      height: 150, 
                      margin: 'auto', 
                      border: '5px solid white',
                      boxShadow: 3,
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={8}>
                  <Typography variant="h4" component="div" gutterBottom>{values.name}</Typography>
                  <Box display="flex" alignItems="center" mb={1}>
                    <WorkIcon sx={{ marginRight: 1, color: 'primary.main' }} />
                    <Typography variant="h6">{values.role}</Typography>
                  </Box>
                  <Box display="flex" alignItems="center">
                    <EmailIcon sx={{ marginRight: 1, color: 'primary.main' }} />
                    <Typography variant="body1">{values.email}</Typography>
                  </Box>
                </Grid>
              </Grid>
              <Divider sx={{ my: 3, backgroundColor: 'primary.light' }} />
              <Box display="flex" justifyContent="center">
                <Typography variant="body1" paragraph sx={{ maxWidth: '80%', textAlign: 'center' }}>
                  {values.bio}
                </Typography>
              </Box>
              <Box mt={2} display="flex" justifyContent="center" flexWrap="wrap">
                {['React', 'TypeScript', 'Material-UI'].map((skill) => (
                  <Chip
                    key={skill}
                    label={skill}
                    sx={{ 
                      margin: 0.5, 
                      backgroundColor: 'primary.light', 
                      color: 'primary.contrastText'
                    }}
                  />
                ))}
              </Box>
            </CardContent>
          </StyledCard>
          <Box textAlign="center" mt={3}>
            <Button
              variant="contained"
              onClick={() => {
                navigate("edit");
              }}
              sx={{ 
                backgroundColor: 'primary.main', 
                color: 'primary.contrastText',
                '&:hover': {
                  backgroundColor: 'primary.dark',
                },
              }}
            >
              Editar Perfil
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
};

export default ProfileView;


import React from "react";
import { Box, Button, Typography, Card, CardContent, Avatar, Grid, Divider, Chip } from "@mui/material";
import { styled } from "@mui/material/styles";
import EmailIcon from "@mui/icons-material/Email";
import WorkIcon from "@mui/icons-material/Work";
import { useNavigate } from 'react-router-dom';
import { useAppContext } from "@/context/app";

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
  const { auth } = useAppContext();
  const navigate = useNavigate();

  const { first_name, last_name, email } = auth || {};

  return (
    <Box width="100%">
      <StyledCard>
        <CardContent sx={{ padding: 4 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={4}>
              <Avatar
                alt={first_name}
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
              <Typography variant="h4" component="div" gutterBottom>{first_name}</Typography>
              <Box display="flex" alignItems="center" mb={1}>
                <WorkIcon sx={{ marginRight: 1, color: 'primary.main' }} />
                <Typography variant="h6">{last_name}</Typography>
              </Box>
              <Box display="flex" alignItems="center">
                <EmailIcon sx={{ marginRight: 1, color: 'primary.main' }} />
                <Typography variant="body1">{email}</Typography>
              </Box>
            </Grid>
          </Grid>
          <Divider sx={{ my: 3, backgroundColor: 'primary.light' }} />
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
    </Box>
  );
};

export default ProfileView;
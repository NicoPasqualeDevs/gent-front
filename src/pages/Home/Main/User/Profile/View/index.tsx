import React from "react";
import { Box, Button, Typography, Card, CardContent, Avatar, Grid, Divider } from "@mui/material";
import { styled } from "@mui/material/styles";
import EmailIcon from "@mui/icons-material/Email";
import PersonIcon from "@mui/icons-material/Person";
import { useNavigate } from 'react-router-dom';
import { useAppContext } from "@/context";
import { DashboardContainer, DashboardContent } from "@/utils/DashboardsUtils";

const StyledCard = styled(Card)(({ theme }) => ({
  maxWidth: 800,
  margin: 'auto',
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
    <DashboardContainer>
      <DashboardContent>
        <StyledCard>
          <CardContent sx={{ padding: 4 }}>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={4}>
                <Avatar
                  alt={first_name}
                  sx={{
                    width: 150,
                    height: 150,
                    margin: 'auto',
                    border: '5px solid white',
                    boxShadow: 3,
                    bgcolor: 'primary.main'
                  }}
                >
                  {first_name?.[0]?.toUpperCase()}
                </Avatar>
              </Grid>
              <Grid item xs={12} md={8}>
                <Typography variant="h4" component="div" gutterBottom>
                  {first_name} {last_name}
                </Typography>
                <Box display="flex" alignItems="center" mb={2}>
                  <PersonIcon sx={{ marginRight: 1, color: 'primary.main' }} />
                  <Typography variant="h6">
                    {auth?.is_superuser ? 'Administrador' : 'Usuario'}
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center">
                  <EmailIcon sx={{ marginRight: 1, color: 'primary.main' }} />
                  <Typography variant="body1">{email}</Typography>
                </Box>
              </Grid>
            </Grid>
            
            <Divider sx={{ my: 3, backgroundColor: 'primary.light' }} />
            
            <Box mt={2} display="flex" justifyContent="center">
              <Button
                variant="contained"
                onClick={() => navigate("edit")}
                sx={{
                  backgroundColor: 'primary.main',
                  color: 'primary.contrastText',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                  },
                  minWidth: '200px'
                }}
              >
                Editar Perfil
              </Button>
            </Box>
          </CardContent>
        </StyledCard>
      </DashboardContent>
    </DashboardContainer>
  );
};

export default ProfileView;
import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, IconButton, Box, Typography, Stack } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import CategoryIcon from '@mui/icons-material/Category';
import StarIcon from '@mui/icons-material/Star';
import MenuIcon from '@mui/icons-material/Menu';
import { LogoutSharp } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "@/context/app";
import { SuccessToast } from "@/components/Toast";
import PeopleIcon from '@mui/icons-material/People';
import BuildIcon from '@mui/icons-material/Build';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';

interface LeftMenuProps {
  isMobile?: boolean;
  isOpen?: boolean;
  onToggle?: () => void;
}

const LeftMenu: React.FC<LeftMenuProps> = ({ isMobile = false, isOpen = false, onToggle }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { setAuthUser } = useAppContext();

  const handleLogout = () => {
    setAuthUser(null);
    sessionStorage.setItem("user_email", "");
    sessionStorage.setItem("user_token", "");
    navigate("/auth/login", { replace: true });
    SuccessToast("Has cerrado sesión correctamente");
  };

  const menuContent = (
    <Stack
      direction="column"
      sx={{
        height: '100%',
        justifyContent: 'space-between',
      }}
    >
      {/* Cabecera */}
      <Box sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}`, display: 'flex', justifyContent: 'center' }}>
        <Typography
          onClick={() => navigate("/builder")}
          color={theme.palette.text.primary}
          sx={{
            fontSize: "30px",
            cursor: "pointer",
            textAlign: 'center',
          }}
        >
          Gents
        </Typography>
      </Box>

      {/* Contenido central */}
      <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
        <List>
          <ListItem button>
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Inicio" />
          </ListItem>
          <ListItem button>
            <ListItemIcon>
              <CategoryIcon />
            </ListItemIcon>
            <ListItemText primary="Categorías" />
          </ListItem>
          <ListItem button>
            <ListItemIcon>
              <StarIcon />
            </ListItemIcon>
            <ListItemText primary="Favoritos" />
          </ListItem>
          <ListItem button>
            <ListItemIcon>
              <PeopleIcon />
            </ListItemIcon>
            <ListItemText primary="Agentes" />
          </ListItem>
          <ListItem button>
            <ListItemIcon>
              <BuildIcon />
            </ListItemIcon>
            <ListItemText primary="Herramientas" />
          </ListItem>
          <ListItem button>
            <ListItemIcon>
              <SmartToyIcon />
            </ListItemIcon>
            <ListItemText primary="Solicitar IA" />
          </ListItem>
          <ListItem button>
            <ListItemIcon>
              <LibraryBooksIcon />
            </ListItemIcon>
            <ListItemText primary="Librería" />
          </ListItem>
        </List>
      </Box>

      {/* Pie */}
      <Box sx={{ 
        borderTop: `1px solid ${theme.palette.divider}`,
      }}>
        <ListItem 
          button 
          onClick={handleLogout}
          sx={{
            color: theme.palette.text.primary,
            '&:hover': {
              color: theme.palette.primary.main,
            },
          }}
        >
          <ListItemIcon>
            <LogoutSharp sx={{ transform: "scaleX(-1)" }} />
          </ListItemIcon>
          <ListItemText primary="Cerrar Sesión" />
        </ListItem>
      </Box>
    </Stack>
  );

  if (isMobile) {
    return (
      <>
        <Box
          sx={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: theme.palette.background.paper,
            display: 'flex',
            justifyContent: 'center',
            p: 1,
            height: '54px',
            zIndex: theme.zIndex.drawer + 1,
          }}
        >
          <IconButton onClick={onToggle} color="inherit">
            <MenuIcon />
          </IconButton>
        </Box>
        <Drawer
          anchor="bottom"
          open={isOpen}
          onClose={onToggle}
          sx={{
            '& .MuiDrawer-paper': {
              width: '100%',
              height: 'calc(100% - 54px)',
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              bottom: 54, // Elevamos el contenedor 54px desde abajo
            },
          }}
        >
          {menuContent}
        </Drawer>
      </>
    );
  }

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 240,
          boxSizing: 'border-box',
          backgroundColor: theme.palette.background.paper,
          height: '100%',
        },
      }}
    >
      {menuContent}
    </Drawer>
  );
};

export default LeftMenu;

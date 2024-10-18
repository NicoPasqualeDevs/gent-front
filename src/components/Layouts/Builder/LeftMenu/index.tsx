import { Box, Stack, Typography } from "@mui/material";
import { useAppContext } from "@/context/app";
import { useNavigate } from "react-router-dom";
import { LeftMenuContainer } from "@/components/StyledComponents/Layout";
import { SuccessToast } from "@/components/Toast";
import { LogoutSharp } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { useMediaQuery } from "@mui/material";
import { useEffect, useState } from "react";
import { languages } from "@/utils/traslations";

const LeftMenu: React.FC = () => {
  const navigate = useNavigate();
  const { menu, navElevation, setNavElevation, setAuth, setMenu, language, auth } = useAppContext();
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));
  const [isInitialRender, setIsInitialRender] = useState(true);
  const t = languages[language as keyof typeof languages];

  const options = [
    {
      navElevation: t.leftMenu.aiTeams,
      label: t.leftMenu.aiTeams,
      path: "/builder",
    },
  ];

  // Opción de registro de equipo solo para superusuarios
  const superUserOptions = [
    {
      navElevation: t.leftMenu.registerTeam,
      label: t.leftMenu.registerTeam,
      path: "/builder/form",
    },
    {
      navElevation: t.leftMenu.registerUser,
      label: t.leftMenu.registerUser,
      path: "/auth/register",
    },
  ];

  useEffect(() => {
    console.log('Auth state:', auth);
    if (isInitialRender) {
      setMenu(false);
      setIsInitialRender(false);
    }
  }, [isInitialRender, setMenu, auth]);

  return (
    <>
      {menu && !isLargeScreen && (
        <Box
          display={{ xs: "block", lg: "none" }}
          sx={{
            position: "fixed",
            backdropFilter: "blur(2px)",
            width: "100%",
            height: "100%",
            zIndex: 102,
          }}
        />
      )}
      <LeftMenuContainer
        position="fixed"
        top="70px"
        left="0"
        sx={{
          paddingLeft: "5px",
          flexShrink: "0",
          width: { 
            xs: menu ? "100%" : "0px", 
            lg: menu ? "160px" : "0px" 
          },
          height: { 
            xs: menu ? "calc(50% - 35px)" : "0px", 
            lg: "calc(100% - 70px)" 
          },
          background: theme.palette.background.default, // Añadido color de fondo
          borderRight: {
            xs: "none",
            lg: `1px solid ${menu ? theme.palette.primary.main : "transparent"}`,
          },
          borderBottom: {
            xs: `1px solid ${menu ? theme.palette.primary.main : "transparent"}`,
            lg: "none",
          },
          transition: "width 0.3s ease-in-out, height 0.3s ease-in-out",
          overflow: "hidden",
          zIndex: 103,
        }}
      >
        <Stack
          direction={"column"}
          sx={{
            paddingTop: "20px",
            paddingRight: `${menu ? "20px" : "0px"}`,
            paddingLeft: `${menu ? "10px" : "0px"}`,
            height: "100%",
          }}
        >
          {options.map((option, index) => {
            return (
              <Typography
                key={`menu-option-${index}`}
                sx={{
                  cursor: "pointer",
                  marginBottom: "10px",
                  opacity: `${menu ? "1" : "0"}`,
                  fontSize: `${menu ? "110%" : "0px"}`,
                  transition: `font-size ${theme.transitions.duration.standard}ms, color ${theme.transitions.duration.standard}ms`,
                  color:
                    navElevation === option.navElevation
                      ? theme.palette.primary.main
                      : theme.palette.text.primary, // Cambiado a color de texto primario
                  ":hover": {
                    color: theme.palette.primary.main,
                  },
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
                onClick={() => {
                  setNavElevation(option.navElevation);
                  navigate(option.path);
                }}
              >
                {option.label}
              </Typography>
            );
          })}
          {auth?.user?.is_superuser && superUserOptions.map((option, index) => (
            <Typography
              key={`menu-option-super-${index}`}
              sx={{
                cursor: "pointer",
                marginBottom: "10px",
                opacity: `${menu ? "1" : "0"}`,
                fontSize: `${menu ? "110%" : "0px"}`,
                transition: `font-size ${theme.transitions.duration.standard}ms, color ${theme.transitions.duration.standard}ms`,
                color: navElevation === option.navElevation
                  ? theme.palette.primary.main
                  : theme.palette.text.primary,
                ":hover": {
                  color: theme.palette.primary.main,
                },
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
              onClick={() => {
                setNavElevation(option.navElevation);
                navigate(option.path);
              }}
            >
              {option.label}
            </Typography>
          ))}
          <Box
            sx={{
              height: "100%",
              display: "flex",
              alignItems: "flex-end",
            }}
          >
            <Typography
              sx={{
                opacity: `${menu ? "1" : "0"}`,
                fontSize: `${menu ? "100%" : "0px"}`,
                transition: `font-size ${theme.transitions.duration.complex}ms, color ${theme.transitions.duration.standard}ms`,
                display: "flex",
                alignItems: "center",
                paddingBottom: "20px",
                cursor: "pointer",
                color: theme.palette.text.primary, // Cambiado a color de texto primario
                ":hover": {
                  color: theme.palette.primary.main,
                },
              }}
              onClick={() => {
                setAuth(null);
                sessionStorage.setItem("user_email", "");
                sessionStorage.setItem("user_token", "");
                navigate("/auth/login", { replace: true });
                SuccessToast(t.leftMenu.logoutSuccess);
              }}
            >
              <LogoutSharp
                sx={{
                  opacity: `${menu ? "1" : "0"}`,
                  marginRight: "5px",
                  transform: "scaleX(-1)",
                }}
              />
              {t.leftMenu.logout}
            </Typography>
          </Box>
        </Stack>
      </LeftMenuContainer>
    </>
  );
};

export default LeftMenu;

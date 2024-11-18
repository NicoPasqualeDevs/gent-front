import { alpha, Box, Stack, Typography } from "@mui/material";
import { useAppContext } from "@/context";
import { useNavigate } from "react-router-dom";
import { LeftMenuContainer } from "@/components/styledComponents/Layout";
import { SuccessToast } from "@/components/Toast";
import { LogoutSharp } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { useMediaQuery } from "@mui/material";
import { languages } from "@/utils/Traslations";
import { useEffect } from "react";
import { KeyboardArrowUp } from "@mui/icons-material";
import { Fab } from "@mui/material";

const LeftMenu: React.FC = () => {
  const navigate = useNavigate();
  const { menu, navElevation, setMenu, setNavElevation, setAuth, language, auth, replacePath } = useAppContext();
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));
  const t = languages[language as keyof typeof languages];

  const menuOptions = [
    {
      navElevation: t.leftMenu.aiTeams,
      translationKey: "aiTeams",
      label: t.leftMenu.aiTeams,
      path: "/builder",
      requireSuperUser: false,
      disabled: false
    },
    {
      navElevation: t.leftMenu.registerTeam,
      translationKey: "registerTeam",
      label: t.leftMenu.registerTeam,
      path: "/builder/form",
      requireSuperUser: true,
      disabled: false
    },
    {
      navElevation: t.leftMenu.registerUser,
      translationKey: "registerUser",
      label: t.leftMenu.registerUser,
      path: "/builder/register-user",
      requireSuperUser: true,
      disabled: false
    },
    {
      navElevation: t.leftMenu.tools,
      translationKey: "tools",
      label: t.leftMenu.tools,
      path: "/builder/admin-tools-form",
      requireSuperUser: true,
      disabled: false
    },
    {
      navElevation: t.leftMenu.workShop,
      translationKey: "workShop",
      label: t.leftMenu.workShop,
      path: "/home",
      requireSuperUser: false,
      disabled: true
    }
  ];

  const filteredOptions = menuOptions.filter(option => 
    !option.requireSuperUser || auth?.is_superuser
  );

  // Limpiar la navegación al montar el componente
  useEffect(() => {
    replacePath([]);
  }, []);

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
            xs: menu ? "calc(99% - 35px)" : "0px", 
            lg: "calc(100% - 70px)" 
          },
          background: theme.palette.background.default, // Añadido color de fondo
          borderRight: {
            xs: "none",
            lg: `1px solid ${menu ? alpha(theme.palette.primary.light, 0.5) : "transparent"}`,
          },
          borderBottom: {
            xs: `0px solid ${menu ? alpha(theme.palette.primary.light, 0.5) : "transparent"}`,
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
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '12px'
          }}>
            {filteredOptions.map((option, index) => (
              <Typography
                key={`menu-option-${index}`}
                sx={{
                  cursor: option.disabled ? "not-allowed" : "pointer",
                  opacity: `${menu ? (option.disabled ? "0.5" : "1") : "0"}`,
                  fontSize: `${menu ? "110%" : "0px"}`,
                  transition: `font-size ${theme.transitions.duration.standard}ms, color ${theme.transitions.duration.standard}ms`,
                  color:
                    navElevation === option.navElevation
                      ? theme.palette.primary.main
                      : theme.palette.text.primary,
                  ":hover": {
                    color: option.disabled ? "inherit" : theme.palette.primary.main,
                  },
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  padding: "6px 0",
                }}
                onClick={() => {
                  if (!option.disabled) {
                    setNavElevation(option.navElevation);
                    replacePath([
                      {
                        label: option.label,
                        translationKey: option.translationKey,
                        current_path: option.path,
                        preview_path: "/",
                      },
                    ]);
                    navigate(option.path);
                  }
                }}
              >
                {option.label}
              </Typography>
            ))}
          </Box>

          <Box
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              gap: 2,
              paddingBottom: "20px"
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
              <LogoutSharp />
              {t.leftMenu.logout}
            </Typography>

            <Box sx={{ 
              display: { xs: menu ? 'flex' : 'none', lg: 'none' }, 
              justifyContent: 'center',
              position: 'absolute',
              bottom: '28px',
              left: '50%',
              transform: 'translateX(-50%)'
            }}>
              <Fab 
                color="primary"
                onClick={() => setMenu(!menu)}
                size="medium"
                sx={{
                  backgroundColor: alpha(theme.palette.primary.dark, 0.25),
                  color: theme.palette.primary.contrastText,
                }}
              >
                <KeyboardArrowUp />
              </Fab>
            </Box>
          </Box>
        </Stack>
      </LeftMenuContainer>
    </>
  );
};

export default LeftMenu;

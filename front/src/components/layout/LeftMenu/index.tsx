import { Box, Stack, Typography } from "@mui/material";
import { useAppContext } from "@/context/app";
import { useNavigate } from "react-router-dom";
import theme from "@/styles/theme";
import { LeftMenuContainer } from "@/components/styledComponents/Layout";
import { SuccessToast } from "@/components/Toast";
import { LogoutSharp } from "@mui/icons-material";

const options = [
  {
    navElevation: "clients",
    label: "Equipos IA",
    path: "/clients",
  },
  {
    navElevation: "Register",
    label: "Registrar Equipo",
    path: "/clients/form",
  },
/*   {
    navElevation: "Tools",
    label: "Tools",
    path: "/bots/tools",
  }, */
];

const LeftMenu: React.FC = () => {
  const navigate = useNavigate();
  const { menu, navElevation, setNavElevation, setAuthUser } = useAppContext();
  return (
    <>
      {menu && (
        <Box
          display={{ xs: "block", sm: "none" }}
          sx={{
            position: "fixed",
            backdropFilter: "blur(2px)",
            width: "100%",
            height: "100%",
            zIndex: "101",
          }}
        />
      )}
      <LeftMenuContainer
        position={{ xs: "fixed", sm: "relative" }}
        top={{ xs: "70px", sm: "0px" }}
        sx={{
          paddingLeft: "5px",
          flexShrink: "0",
          width: `${menu ? "160px" : "0px"}`,
          background:"transparent",
          borderRight: `1px solid ${
            menu ? theme.palette.primary.main : "transparent"
          }`,
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
                      : "white",
                  ":hover": {
                    color: theme.palette.primary.main,
                  },
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
                ":hover": {
                  color: theme.palette.primary.main,
                },
              }}
              onClick={() => {
                setAuthUser(null);
                sessionStorage.setItem("user_email", "");
                sessionStorage.setItem("user_token", "");
                navigate("/auth/admLogin", { replace: true });
                SuccessToast("Has cerrado sesión correctamente");
              }}
            >
              <LogoutSharp
                sx={{
                  opacity: `${menu ? "1" : "0"}`,
                  marginRight: "5px",
                  transform: "scaleX(-1)",
                }}
              />
              Cerrar Sesión
            </Typography>
          </Box>
        </Stack>
      </LeftMenuContainer>
    </>
  );
};

export default LeftMenu;

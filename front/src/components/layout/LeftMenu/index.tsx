import { Box, Stack, Typography } from "@mui/material";
import { useAppContext } from "@/context/app";
import { useNavigate } from "react-router-dom";
import theme from "@/styles/theme";
import { LeftMenuContainer } from "@/components/styledComponents/Layout";

const options = [
  {
    navElevation: "clients",
    label: "Clientes",
    path: "/clients",
  },
  {
    navElevation: "Register",
    label: "Registrar Cliente",
    path: "/clients/form",
  },
  {
    navElevation: "Tools",
    label: "Tools",
    path: "/bots/tools",
  },
];

const LeftMenu: React.FC = () => {
  const navigate = useNavigate();
  const { menu, navElevation, setNavElevation, setAuthUser } =
    useAppContext();
  return (
    <>
      <LeftMenuContainer
        sx={{
          width: `${menu ? "220px" : "0px"}`,
          borderRight: `1px solid ${
            menu ? theme.palette.primary.main : "transparent"
          }`,
        }}
      >
        <Stack
          direction={"column"}
          sx={{
            paddingTop: "100px",
            paddingRight: `${menu ? "30px" : "0px"}`,
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
                  fontSize: `${menu ? "130%" : "0px"}`,
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
              alignItems: "end",
            }}
          >
            <Typography
              sx={{
                opacity: `${menu ? "1" : "0"}`,
                fontSize: `${menu ? "130%" : "0px"}`,
                transition: `font-size ${theme.transitions.duration.standard}ms`,
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
              }}
            >
              Cerrar Sesión
            </Typography>
          </Box>
        </Stack>
      </LeftMenuContainer>
    </>
  );
};

export default LeftMenu;

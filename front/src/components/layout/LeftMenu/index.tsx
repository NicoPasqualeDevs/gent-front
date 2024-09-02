import { Box, styled, Stack, Grid, Typography } from "@mui/material";
import { useAppContext } from "@/context/app";
import { useNavigate } from "react-router-dom";
import BackButton from "../BackButton";
import theme from "@/styles/theme";

const LeftMenuContainer = styled(Box)(() => ({
  "&.MuiBox-root": {
    background: "transparent",
    borderRadius: "64px",
    padding: "16px",
    marginTop: "180px",
    position: "fixed",
    zIndex: 2,
  },
}));

const NavButtons = styled(Typography)(({ theme }) => ({
  "&.MuiTypography-root": {
    fontSize: "18px",
    width: "auto",
    padding: "2px 0px",
    margin: "7px 0px",
    cursor: "pointer",
    transition: "color 0.2s ease-in-out",
    ":hover": {
      color: theme.palette.primary.main,
    },
  },
}));

const LeftMenu: React.FC = () => {
  const navigate = useNavigate();
  const { navElevation, setNavElevation } = useAppContext();

  return (
    <LeftMenuContainer>
      <Grid>
        <Stack sx={{ position: "relative !important" }}>
          {window.location.pathname === "/" ? <></> : <BackButton />}
          <NavButtons
            sx={{
              color:
                navElevation === "clients"
                  ? theme.palette.primary.main
                  : "white",
              borderBottom: `1px solid ${
                navElevation === "clients"
                  ? theme.palette.primary.main
                  : "transparent"
              }`,
            }}
            onClick={() => {
              navigate("/clients");
              setNavElevation("clients");
            }}
          >
            Clientes
          </NavButtons>
          <NavButtons
            sx={{
              color:
                navElevation === "Register"
                  ? theme.palette.primary.main
                  : "white",
              borderBottom: `1px solid ${
                navElevation === "Register"
                  ? theme.palette.primary.main
                  : "transparent"
              }`,
            }}
            onClick={() => {
              navigate("/clients/form");
              setNavElevation("Register");
            }}
          >
            Registrar nuevo cliente
          </NavButtons>
          <NavButtons
            sx={{
              color:
                navElevation === "Tools" ? theme.palette.primary.main : "white",
              borderBottom: `1px solid ${
                navElevation === "Tools"
                  ? theme.palette.primary.main
                  : "transparent"
              }`,
            }}
            onClick={() => {
              navigate("/bots/tools");
              setNavElevation("Tools");
            }}
          >
            Tools
          </NavButtons>
        </Stack>
      </Grid>
    </LeftMenuContainer>
  );
};

export default LeftMenu;

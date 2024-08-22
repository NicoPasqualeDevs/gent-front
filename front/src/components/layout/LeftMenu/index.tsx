import { Box, styled, Stack, Grid, Typography } from "@mui/material";
import { useAppContext } from "@/context/app";
import { useNavigate } from "react-router-dom";
import Logo from "@/components/Logo";
import theme from "@/styles/theme";

const LeftMenuContainer = styled(Box)(({ theme }) => ({
  "&.MuiBox-root": {
    background: theme.palette.primary.main,
    minHeight: "1000px",
    minWidth: "1000px",
    left: -720,
    top: 95,
    //color: "red",
    borderRadius: "64px",
    padding: "16px",
    position: "fixed",
    transform: "rotate(85deg)",
    zIndex: 2,
  },
}));

const HeaderProfileIcon = styled(Box)(({ theme }) => ({
  "&.MuiBox-root": {
    zIndex: 3,
    position: "absolute",
    background: "white",
    height: "108px !important",
    width: "108px !important",
    top: -155,
    left: 105,
    borderRadius: "56px",
    border: `solid 3px ${theme.palette.primary.main}`,
  },
}));

const StyledImage = styled(Logo)(() => ({
  height: "108px !important",
  width: "108px !important",
  borderRadius: "54px",
  cursor: "pointer",
}));

const NavButtons = styled(Typography)(({ theme }) => ({
  "&.MuiTypography-root": {
    fontSize: "18px",
    width: "auto",
    padding: "2px 0px",
    margin: "7px 0px",
    cursor: "pointer",
    transition: "color 0.2s ease-in-out",
    //color: "white",

    ":hover": {
      color: theme.palette.secondary.dark,
    },
  },
  
}));

const LeftMenu: React.FC = () => {
  const navigate = useNavigate();
  const { navElevation, setNavElevation } = useAppContext();

  return (
    <LeftMenuContainer>
      <Grid
        sx={{
          transform: "rotate(-85deg)",
          position: "absolute",
          top: 80,
          left: 85,
        }}
      >
        <Stack sx={{ position: "relative !important" }}>
          <NavButtons
            sx={{
              color: navElevation === "clients" ? theme.palette.secondary.dark : "white",
              borderTop: `1px solid ${
                navElevation === "clients" ? theme.palette.secondary.dark : "transparent"
              }`,
            }}
            onClick={() => {
              navigate("/clients");
              setNavElevation("clients");
            }}
          >
            Clientes
          </NavButtons>
{/*           <NavButtons
            sx={{
              color: navElevation === "teams" ? theme.palette.secondary.dark : "white",
              borderTop: `1px solid ${
                navElevation === "teams" ? theme.palette.secondary.dark : "transparent"
              }`,
            }}
            onClick={() => {
              setNavElevation("teams");
            }}
          >
            Teams
          </NavButtons> */}
          <NavButtons
            sx={{
              color: navElevation === "client" ? theme.palette.secondary.dark : "white",
              borderTop: `1px solid ${
                navElevation === "client" ? theme.palette.secondary.dark : "transparent"
              }`,
            }}
            onClick={() => {
              navigate("/clients/form");
              setNavElevation("client");
            }}
          >
            Registrar nuevo cliente
          </NavButtons>
        </Stack>
        <HeaderProfileIcon
          onClick={() => {
            navigate("/");
            setNavElevation("");
          }}
        >
          <StyledImage />
        </HeaderProfileIcon>
      </Grid>
    </LeftMenuContainer>
  );
};

export default LeftMenu;

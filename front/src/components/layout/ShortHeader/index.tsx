import React, { useState } from "react";
import { styled, Typography, Grid, Stack } from "@mui/material";
import { useAppContext } from "@/context/app";
import { useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import BackButton from "../BackButton";
import theme from "@/styles/theme";

const HeaderContainer = styled(Grid)(({ theme }) => ({
  "&.MuiGrid-root": {
    position: "fixed",
    zIndex: 2,
    background: theme.palette.secondary.dark,
    borderRadius: "0px 0px 16px 0px",
    minHeight: "68px",
    color: "#fff",
    padding: "16px",
    width: "100%",
  },
}));

const LoginMail = styled(Typography)(() => ({
  "&.MuiTypography-root": {
    backgroundColor: "white",
    borderRadius: "10px",
    fontSize: "15px",
    padding: "4px 24px",
    color: theme.palette.secondary.dark,
    display: "inline-block",
  },
}));

const NavButtons = styled(Typography)(({ theme }) => ({
  "&.MuiTypography-root": {
    color: "white",
    fontSize: "18px",
    width: "auto",
    padding: "2px 0px",
    margin: "7px 0px",
    border: "none",
    cursor: "pointer",
    transition: theme.transitions.duration.standard,
  },
  ":hover": {
    color: theme.palette.primary.light,
  },
}));

const StyledDropDownButton = styled(MenuIcon)(({ theme }) => ({
  "&.MuiSvgIcon-root": {
    color: "white",
    width: "32px",
    borderRadius: "16px",
    cursor: "pointer",
    transition: `${theme.transitions.duration.shortest}ms`,
  },
  ":hover": {
    color: theme.palette.primary.light,
  },
}));

const ShortHeader: React.FC = () => {
  const { setAuthUser } = useAppContext();
  const [menuState, setMenuState] = useState<boolean>(false);

  const handleClick = () => {
    setMenuState(!menuState);
  };

  const navigate = useNavigate();
  return (
    <HeaderContainer display={"flex"}>
      <Grid
        container
        item
        xs={12}
        sx={{
          marginTop: `${menuState ? "0px" : "-250px"}`,
          transition: "500ms",
        }}
      >
        <Grid item display={"flex"} xs={12} sx={{ height: "250px !important" }}>
          <Stack sx={{ position: "relative", marginLeft: "24px" }}>
            <NavButtons
              onClick={() => {
                navigate("/bots");
                setMenuState(false);
              }}
            >
              Bots
            </NavButtons>
            <NavButtons
              onClick={() => {
                setMenuState(false);
              }}
            >
              Teams
            </NavButtons>
            <NavButtons
              onClick={() => {
                navigate("/bots/client");
                setMenuState(false);
              }}
            >
              Registrar nuevo cliente
            </NavButtons>
            <NavButtons
              onClick={() => {
              setAuthUser({ email: "", token: "" });
              sessionStorage.clear();
              setMenuState(false);
            }}
            >
              Cerrar Sesión
            </NavButtons>
          </Stack>
        </Grid>
        <Grid item xs={12} display={"flex"}>
          <Grid item xs={1}></Grid>
          <Grid item xs={2} alignContent={"center"} textAlign={"left"}>
            <BackButton />
          </Grid>
          <Grid item xs={6} alignContent={"center"}>
            <LoginMail>
              {sessionStorage.getItem("user_email") ? sessionStorage.getItem("user_email") : "sin mail"}  
            </LoginMail>
          </Grid>
          <Grid item xs={2} alignContent={"center"} textAlign={"right"}>
            <Typography>
              <StyledDropDownButton
                onClick={() => handleClick()}
                sx={{
                  fontSize: "36px",
                  cursor: "pointer",
                  color: "white",
                }}
              />
            </Typography>
          </Grid>
          <Grid item xs={1}></Grid>
        </Grid>
      </Grid>
    </HeaderContainer>
  );
};

export default ShortHeader;

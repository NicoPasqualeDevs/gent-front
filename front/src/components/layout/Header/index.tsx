import React from "react";
import { Box, BoxProps, styled, Typography, Grid } from "@mui/material";
import { useAppContext } from "@/context/app";
import BackButton from "../BackButton";
import theme from "@/styles/theme";

const HeaderContainer = styled(Box)<BoxProps>(({ theme }) => ({
  "&.MuiBox-root": {
    position: "fixed",
    zIndex: 2,
    width: "100%",
    //top: 0,
    background: theme.palette.secondary.dark,
    minHeight: "68px",
    color: theme.palette.secondary.dark,
    borderRadius: "0px 0px 16px 0px",
    padding: "16px",
  },
}));

const LoginMail = styled(Typography)(() => ({
  "&.MuiTypography-root": {
    backgroundColor: "white",
    borderRadius: "10px",
    fontSize: "18px",
    padding: "4px 24px",
  },
}));

const LogOutButton = styled(Typography)(() => ({
  "&.MuiTypography-root": {
    backgroundColor: theme.palette.primary.main,
    borderRadius: "10px",
    fontSize: "18px",
    padding: "4px 24px",
    marginLeft: "16px",
    cursor: "pointer",
    color: theme.palette.info.main,
    transition: "background-color 0.2s ease-in-out",
    marginRight: "40px",

    "&:hover": {
      backgroundColor: theme.palette.primary.dark,
    },
  },
}));

const Header: React.FC = () => {
  const { setAuthUser } = useAppContext();

  return (
    <HeaderContainer>
      <Grid
        item
        margin={"18px 0px"}
        xs={12}
        display={"flex"}
        justifyContent={"end"}
        alignContent={"center"}
      >
        <LoginMail>
          {sessionStorage.getItem("user_email")
            ? sessionStorage.getItem("user_email")
            : "sin mail"}
        </LoginMail>
        <LogOutButton
          onClick={() => {
            location.reload();
            setAuthUser({ email: "", token: "" });
            sessionStorage.clear();
          }}
        >
          Cerrar Sesión
        </LogOutButton>
      </Grid>
      <Box sx={{ position: "absolute", top: 32, left: 325, display: "flex" }}>
        <Box
          sx={{
            position: "absolute",
            left: -300,
          }}
        >
          {window.location.pathname === "/" ? <></> : <BackButton />}
        </Box>
      </Box>
    </HeaderContainer>
  );
};

export default Header;

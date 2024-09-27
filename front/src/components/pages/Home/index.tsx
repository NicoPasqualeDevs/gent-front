import React, { useEffect } from "react";
import { useAppContext } from "@/context/app";
import { Grid, Typography, Paper } from "@mui/material";
import { CenterComponentContainer } from "@/utils/ContainerUtil";
import theme from "@/styles/theme";

const HomeComponent: React.FC = () => {
  const {
    loaded,
    layout: { breakpoint },
  } = useAppContext();

  useEffect(() => {
    if (loaded) {
      console.log(breakpoint, "<-- BreakPoint");
    }
  }, [loaded, breakpoint]);

  return (
      <CenterComponentContainer container>
        <Grid
          item
          xs={10}
          md={8}
          lg={6}
          textAlign={"center"}
          sx={{ margin: "20px auto"}}
        >
          <Paper sx={{ 
            padding: "8% 12%",
            borderRadius: "10px",
            backgroundColor: theme.palette.info.light 
          }}>
            <Typography
              textAlign={"left"}
              variant="h4"
              color={theme.palette.secondary.dark}
              padding={"12px 0"}
            >
              Bienvenido
            </Typography>
            <Typography textAlign={"justify"} padding={"12px 0"}>
              Esta herramienta le permitirá ingresar sus datos de manera
              sencilla y rápida los cuales serán procesados por nuestro motor de
              inteligencia artificial, o como lo llamamos nosotros
              <span style={{ color: theme.palette.primary.dark }}> Helpi</span>
              .
              <br /> <br />
              <span style={{ color: theme.palette.primary.dark }}> Helpi</span>
              . está desarrollado con la última tecnología en materia de
              inteligencia artificial, y la amplia experiencia de Agents en
              atención al cliente, generando una potente herramienta de fácil
              acceso y rápida implementación.
            </Typography>
            <Grid
              item
              justifyContent={"rigth"}
              sx={{ marginTop: "24px" }}
              display={"flex"}
            >
            </Grid>
          </Paper>
        </Grid>
      </CenterComponentContainer>
  );
};

export default HomeComponent;

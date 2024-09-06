import React from "react";
import LeftMenu from "./LeftMenu";
import { useAppContext } from "@/context/app";
import Header from "./Header";
import { Box, Grid, Typography } from "@mui/material";
import theme from "@/styles/theme";
import { MainContent } from "../styledComponents/Layout";

interface ComponentProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<ComponentProps> = ({ children }) => {
  const { menu } = useAppContext();
  return (
    <>
      <LeftMenu />
      <Header />
      <Box
        sx={{
          position: "fixed",
          top: "70px",
          width: "98%",
          backgroundColor: "#0C0C22",
          height: "50px",
          zIndex: "101",
          display: "flex",
          alignItems: "center",
          paddingLeft: "10px",
        }}
      >
        <Typography
          sx={{
            paddingLeft: `${menu ? "220px" : "0px"}`,
            transition: `padding-left ${theme.transitions.duration.standard}ms`,
          }}
        >
          Prueba / Prueba / Prueba
        </Typography>
      </Box>
      <MainContent container>
        <Grid item xs={10} md={7} lg={5}>
          {children}
        </Grid>
      </MainContent>
    </>
  );
};

export default AppLayout;

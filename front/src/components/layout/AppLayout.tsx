import React from "react";
import LeftMenu from "./LeftMenu";
import Header from "./Header";
import { Grid } from "@mui/material";
import { MainContent } from "../styledComponents/Layout";
import Pathbar from "./Pathbar";

interface ComponentProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<ComponentProps> = ({ children }) => {
  return (
    <>
      <LeftMenu />
      <Header />
      <Pathbar />
      <MainContent container>
        <Grid item xs={10} md={7} lg={5}>
          {children}
        </Grid>
      </MainContent>
    </>
  );
};

export default AppLayout;

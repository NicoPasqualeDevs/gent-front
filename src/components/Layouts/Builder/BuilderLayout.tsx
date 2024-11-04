import React from "react";
import LeftMenu from "./LeftMenu";
import Header from "./Header";
import { Grid, Stack } from "@mui/material";
import { MainContent } from "../../styledComponents/Layout";

interface ComponentProps {
  children: React.ReactNode;
}

const BuilderLayout: React.FC<ComponentProps> = ({ children }) => {
  return (
    <Stack sx={{ height: '100vh', overflow: 'hidden' }}>
      <Header />
      <Stack 
        direction="row" 
        sx={{ 
          position: 'relative',
          height: 'calc(100vh - 64px)', // Restamos el alto del header
          overflow: 'hidden'
        }}
      >
        <LeftMenu />
        <MainContent container sx={{ overflow: 'hidden' }}>
          <Grid
            item
            xs={11}
            md={9}
            lg={7}
            sx={{
              height: '100%',
              overflow: 'hidden'
            }}
          >
            {children}
          </Grid>
        </MainContent>
      </Stack>
    </Stack>
  );
};

export default BuilderLayout;

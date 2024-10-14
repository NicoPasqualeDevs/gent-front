import React from "react";
import LeftMenu from "./LeftMenu";
import Header from "./Header";
import { Grid, Stack } from "@mui/material";
import { MainContent } from "../StyledComponents/Layout";

interface ComponentProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<ComponentProps> = ({ children }) => {
  return (
    <>
      <Header />
      <Stack direction={"row"} position={"relative"}>
        <LeftMenu />
        <MainContent container>
          <Grid
            item
            xs={11}
            md={9}
            lg={7}
            sx={{
              paddingBottom: "20px",
            }}
          >
            {children}
          </Grid>
        </MainContent>
      </Stack>
    </>
  );
};

export default AppLayout;

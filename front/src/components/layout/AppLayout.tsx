import React, { useEffect } from "react";
import Header from "./Header";
import LeftMenu from "./LeftMenu";
import { useAppContext } from "@/context/app";
import { Grid } from "@mui/material";
import ShortHeader from "./ShortHeader";

interface ComponentProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<ComponentProps> = ({ children }) => {
  const {
    layout: { breakpoint },
  } = useAppContext();

  useEffect(() => {
    if (breakpoint) {
      console.log(breakpoint, "<-- breakpoint");
    }
  }, [breakpoint]);

  return (
    <>
      {breakpoint === "xl" && (
        <Grid>
          <Header />
          <LeftMenu />
          <Grid sx={{ marginLeft: "180px" }}>{children}</Grid>
        </Grid>
      )}
      {breakpoint === "lg" && (
        <Grid>
          <Header />
          <LeftMenu />
          <Grid sx={{ marginLeft: "180px" }}>{children}</Grid>
        </Grid>
      )}
      {breakpoint === "md" && (
        <Grid>
          <ShortHeader />
          <Grid sx={{ marginLeft: "0px" }}>{children}</Grid>
        </Grid>
      )}
      {breakpoint === "sm" && (
        <Grid>
          <ShortHeader />
          <Grid sx={{  marginLeft: "0px" }}>{children}</Grid>
        </Grid>
      )}
      {breakpoint === "xs" && (
        <Grid>
          <ShortHeader />
          <Grid sx={{  marginLeft: "0px" }}>{children}</Grid>
        </Grid>
      )}
    </>
  );
};

export default AppLayout;

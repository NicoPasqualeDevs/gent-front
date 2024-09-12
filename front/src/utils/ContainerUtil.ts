import { Box, Grid, styled } from "@mui/material";

export const MainComponentContainer = styled(Grid)(() => ({
  alignItems: "center",
  justifyContent: "center",
  background: "transparent",
  margin: "40px auto",
}));

export const CenterComponentContainer = styled(Grid)(() => ({
  height: "100vh",
  alignItems: "center",
  justifyContent: "center",
}));

export const ChatViewComponentContainer = styled(Grid)(() => ({
  width: "inherit",
  height: "100vh",
}));

export const ChatViewContainer = styled(Box)(() => ({
  display: "flex",
  justifyContent: "center",
  alignContent: "center",
}));

//----------------- Nuevas

export const MainGridContainer = styled(Grid)(({ theme }) => ({
  justifyContent: "center",
  height: "100vh",
  width: "100vw",
  overflow: "hidden",
  overflowY: "scroll",
  scrollBehavior: "smooth",
  scrollbarGutter: "none",
  scrollbarWidth: "thin",
  scrollbarColor: `${theme.palette.primary.main} transparent`,
}));

export const CardDivider = styled(Box)(() => ({
  width: "100%",
  display: "flex",
  justifyContent: "center",
}));

export const ActionAllowerContainer = styled(Box)(() => ({
  backdropFilter: "blur(2px)",
  width: "100%",
  height: "100%",
  zIndex: "500",
  position: "fixed",
  top: "0px",
  left: "0px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
}));

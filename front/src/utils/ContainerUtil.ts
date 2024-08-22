import { Box, Grid, styled } from "@mui/material";

export const MainComponentContainer = styled(Grid)(() => ({
  height: "100vh",
  alignItems: "start",
  justifyContent: "start",
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
  display: 'flex',
  justifyContent: "center",
  alignContent: "center",  
}))

export const LoginComponentContainer = styled(Box)(() => ({
  height: "100vh",
  width: "100%",
  overflow: 'hidden',
}));




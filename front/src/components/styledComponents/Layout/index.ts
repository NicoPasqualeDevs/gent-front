import { Menu } from "@mui/icons-material";
import { Box, Grid, styled } from "@mui/material";

export const HeaderContainer = styled(Grid)(({ theme }) => ({
  width: "100%",
  height: "70px",
  display: "flex",
  alignItems: "center",
  zIndex: "103",
  backgroundColor: theme.palette.secondary.dark,
  borderBottom: `1px solid ${theme.palette.primary.main}`,
}));

export const BrandContainer = styled(Grid)(() => ({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
}));

export const BrandMenuBtn = styled(Menu)(({ theme }) => ({
  color: "white",
  transition: `color ${theme.transitions.duration.standard}ms`,
  marginLeft: "10px",
  fontSize: "190%",
  cursor: "pointer",
  ":hover": {
    color: theme.palette.primary.main,
  },
}));

export const UserBubbleContainer = styled(Grid)(() => ({
  display: "flex",
  justifyContent: "end",
}));

export const UserBubble = styled(Box)(({ theme }) => ({
  height: "30px",
  paddingLeft: "8px",
  paddingRight: "8px",
  marginRight: "20px",
  display: "flex",
  alignItems: "center",
  borderRadius: "20px",
  backgroundColor: theme.palette.primary.main,
}));

export const LeftMenuContainer = styled(Box)(({ theme }) => ({
  position: "fixed",
  top: "70px",
  width: "220px",
  height: `calc(100vh - 70px)`,
  backgroundColor: theme.palette.secondary.dark,
  transition: `width ${theme.transitions.duration.standard}ms`,
  zIndex: "102",
}));

export const MainContent = styled(Grid)(({ theme }) => ({
  width: "100%",
  height: `calc(100vh - 70px)`,
  paddingTop: "50px",
  justifyContent: "center",
  overflowY: "auto",
  scrollBehavior: "smooth",
  scrollbarGutter: "none",
  scrollbarWidth: "thin",
  scrollbarColor: `${theme.palette.primary.main} transparent`,
}));

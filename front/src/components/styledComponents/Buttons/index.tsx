
import { Button, styled } from "@mui/material";

export const StyledDefaultButton = styled(Button)(({ theme }) => ({
  "&.MuiButton-root": {
    minWidth: "72px",
    lineHeight: "20px",
    //maxWidth: "144px",
    cursor: "pointer",
    fontSize: "14px",
    color: theme.palette.info.main,
    background: theme.palette.secondary.main,
  },
  ":hover": {
    background: theme.palette.primary.main,
  },
}));

export const StyledLinkButton = styled(Button)(({ theme }) => ({
  "&.MuiButton-root": {
    minWidth: "72px",
    lineHeight: "20px",
    cursor: "pointer",
    fontSize: "16px",
    color: theme.palette.secondary.main,
  },
  ":hover": {
    color: theme.palette.primary.dark,
  },
}));

export const StyledLoginButton = styled(Button)(({ theme }) => ({
  "&.MuiButton-root": {
    background: theme.palette.primary.main,
    borderRadius: "10px",
    color: theme.palette.info.main,
    cursor: "pointer",
    fontSize: "14px",
    lineHeight: "40px",
    width: "100%",
    
  },
  ":hover": {
    background: theme.palette.primary.dark,
  },
}));

export const StyledShortLoginButton = styled(Button)(({ theme }) => ({
  "&.MuiButton-root": {
    width: "100%",
    lineHeight: "40px",
    cursor: "pointer",
    fontSize: "14px",
    color: "white",
    background: theme.palette.primary.main,
  },
  ":hover": {
    background: "#2E60A9;",
    color: "white",
  },
}));

import { Button, Typography, styled } from "@mui/material";

export const StyledDefaultButton = styled(Button)(({ theme }) => ({
  "&.MuiButton-root": {
    minWidth: "155px",
    lineHeight: "20px",
    cursor: "pointer",
    fontSize: "14px",
    color: theme.palette.info.main,
    background: theme.palette.secondary.main,
  },
  ":hover": {
    background: theme.palette.primary.main,
    color: theme.palette.secondary.main,
  },
}));

export const StyledDangerButton = styled(Button)(({ theme }) => ({
  "&.MuiButton-root": {
    minWidth: "72px",
    lineHeight: "20px",
    cursor: "pointer",
    fontSize: "14px",
    color: theme.palette.info.main,
    background: theme.palette.error.main,
  },
  ":hover": {
    background: theme.palette.error.dark,
  },
}));

export const StyledLinkButton = styled(Typography)(({ theme }) => ({
  "&.MuiTypography-root": {
    lineHeight: "32px",
    cursor: "pointer",
    fontSize: "16px",
    color: theme.palette.primary.main,
    marginRight: "16px",
  },
  ":hover": {
    color: theme.palette.primary.dark,
  },
}));

export const StyledDangerLinkButton = styled(Typography)(({ theme }) => ({
  "&.MuiTypography-root": {
    textAlign: "right",
    position: "relative",
    lineHeight: "32px",
    cursor: "pointer",
    fontSize: "16px",
    color: "white",
  },
  ":hover": {
    color: theme.palette.error.main,
  },
}));

export const StyledLoginButton = styled(Button)(({ theme }) => ({
  "&.MuiButton-root": {
    background: theme.palette.primary.main,
    borderRadius: "10px",
    fontWeight: 700,
    color: theme.palette.secondary.dark,
    cursor: "pointer",
    fontSize: "14px",
    lineHeight: "40px",
    width: "320px",
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

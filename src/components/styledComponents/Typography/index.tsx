import { Typography, styled } from "@mui/material";

// TITLES

export const StyledPageTitle = styled(Typography)(({ theme }) => ({
  "&.MuiTypography-root": {
    fontSize: "30px",
    textAlign: "start",
    color: theme.palette.primary.main,
    marginBottom: "24px",
  },
}));

export const StyledPageSubTitle = styled(Typography)(({ theme }) => ({
  "&.MuiTypography-root": {
    fontSize: "24px",
    color: theme.palette.primary.main,
  },
}));

// TEXT

export const StyledLoginText = styled(Typography)(() => ({
  "&.MuiTypography-root": {
    color: "white",
    fontSize: "17px",
  },
}));

// CARDS
export const CardTitle = styled(Typography)(() => ({
  "&.MuiTypography-root": {
    color: "white",
    fontSize: "24px",
    textAlign: "left",
  },
}));

export const CardSubTitle = styled(Typography)(() => ({
  "&.MuiTypography-root": {
    color: "white",
    fontSize: "18px",
    textAlign: "left",
    lineHeight: "32px",
  },
}));

export const CardContentText = styled(Typography)(() => ({
  "&.MuiTypography-root": {
    fontSize: "14px",
    textAlign: "left",
    padding: "8px 0",
    color: "white",
  },
}));

// CUSTOM ICONS PROPS

export const DeleteIconProps = {
  position: "absolute",
  top: 7,
  right: 0,
  fontSize: "16px",
  transition: "color 0.2s ease-in-out",
};

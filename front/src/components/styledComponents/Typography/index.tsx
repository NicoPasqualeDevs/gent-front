import { Typography, styled } from "@mui/material";

export const StyledPageTitle = styled(Typography)(({ theme }) => ({
  "&.MuiTypography-root": {
    fontSize: "28px",
    color: theme.palette.secondary.dark,
    variant: "h4",
    textAlign: "left",
    //fontFamily: "Nunito", no deberia hacer falta con el cambio que hice.
    fontWeight: "700",
    lineHeight: "38.19px",
  },
}));

export const StyledPageSubTitle = styled(Typography)(({ theme }) => ({
  "&.MuiTypography-root": {
    fontSize: "20px",
    color: theme.palette.secondary.dark,
    variant: "h4",
    textAlign: "left",
    //fontFamily: "Nunito", no deberia hacer falta con el cambio que hice.
    fontWeight: "550",
    lineHeight: "38.19px",
  },
}));

export const StyledLoginText = styled(Typography)(() => ({
  "&.MuiTypography-root":{
    color: "white",
    fontSize: "17px"
  }
}));
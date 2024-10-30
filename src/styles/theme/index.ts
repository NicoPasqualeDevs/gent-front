import { createTheme, responsiveFontSizes } from "@mui/material";

let theme = createTheme({
  typography: {
    fontFamily: "Nunito",
    fontSize: 13,
    h1: {
      color: "#8BE067", //primary.main.
    },
    h2: {
      color: "#8BE067", //primary.main.
    },
    h3: {
      color: "#8BE067", //primary.main.
    },
    h4: {
      color: "#8BE067", //primary.main.
    },
    h5: {
      color: "#8BE067", //primary.main.
    },
    h6: {
      color: "#8BE067", //primary.main.
    },
    body1: {
      color: "#FFFFFF",
      textAlign: "justify",
    },
    body2: {
      color: "#8BE067", //primary.main
      textAlign: "justify",
    },
    subtitle1: {
      color: "#8BE067", //primary.main.
    },
    subtitle2: {
      color: "#FFFFFF",
    },
  },
  palette: {
    primary: {
      main: "#8BE067",
      light: "#A2E685",
      dark: "#619C48",
      contrastText: "#15163B", //secondary.dark.
    },
    secondary: {
      main: "#303287",
      light: "#546A83",
      dark: "#15163B",
      contrastText: "#8BE067", //primary.main.
    },
    info: {
      main: "#FFFFFF",
      light: "#F2F4F4",
      dark: "#F2FAFA",
      contrastText: "#000000",
    },
    error: {
      main: "#F44336",
      light: "#E57373",
      dark: "#D32F2F",
      contrastText: "#FFFFFF",
    },
    warning: {
      main: "#FFC107",
      light: "#E57373",
      dark: "#D32F2F",
      contrastText: "#FFFFFF",
    },
    background: {
      default: "#0C0C22",
      paper: "#15163B",
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontSize: "1rem",
          borderRadius: "5px",
          width: "100%",
          height: "100%",
          maxHeight: "50px",
          textTransform: "none",
        },
        sizeSmall: {
          fontSize: "0.8rem",
          width: "auto",
          minWidth: "0px",
          padding: "0px 5px",
        },
        sizeMedium: {
          maxWidth: "200px",
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          cursor: "pointer",
        },
      },
    },
    MuiPagination: {
      styleOverrides: {
        root: {
          display: "flex",
          marginTop: "10px",
          marginBottom: "10px",
          ".MuiPaginationItem-root": {
            color: "white",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          border: "1px solid #8BE067", //primary.main.
          marginTop: "0px",
          marginBottom: "20px",
          marginRight: "0px,",
          marginLeft: "0px",
        },
      },
    },
    MuiCardActions: {
      styleOverrides: {
        root: {
          padding: "1% 2.5%",
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: "2.5%",
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: "#8BE067", //primary.color.
          width: "95%",
          margin: "0 auto",
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          marginRight: "10px",
          backgroundColor: "#8BE067", //primary.color
          color: "#15163B", //primary.contrastText
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          fontSize: "85%",
        },
      },
    },
  },
  transitions: {
    duration: {
      shortest: 150,
      shorter: 200,
      short: 250,
      standard: 300,
      complex: 375,
      enteringScreen: 225,
      leavingScreen: 195,
    },
  },
});

theme = responsiveFontSizes(theme);

export default theme;

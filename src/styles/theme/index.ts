import { createTheme as createThemeDefault, responsiveFontSizes } from "@mui/material/styles";

const primaryMainColor = "#6b8bbd";
const primaryLightColor = "#8FA9D3";
const primaryDarkColor = "#4F6995";

const secondaryMainColor = "#E0B4CB";
const secondaryLightColor = "#F0D3E1";
const secondaryDarkColor = "#B2809D";


let theme = createThemeDefault({
  typography: {
    fontFamily: "Nunito",
    fontSize: 13,
    h1: {
      color: "#EACBDF",
    },
    body1: {
      color: primaryLightColor, 
      textAlign: "justify",
    },
    body2: {
      color: "#FFFFFF",
      textAlign: "justify",
    },
    subtitle1: {
      color: "#E2BFD3",
    },
    subtitle2: {
      color: "#FFFFFF",
    },
  },
  palette: {
    mode: "dark", // Cambiamos el modo a oscuro
    primary: {
      main: primaryMainColor,  
      light: primaryLightColor, 
      dark: primaryDarkColor,
      contrastText: "#f5f5f5", // Negro
    },
    secondary: {
      main: secondaryMainColor,
      light: secondaryLightColor, 
      dark: secondaryDarkColor, 
      contrastText: "#1A1A1A", 
    },
    background: {
      default: "#101010", // Gris muy oscuro (fondo principal)
      paper: "#151515", // Gris muy oscuro (elementos de papel)
    },
    text: {
      primary: "#FFFFFF",
      secondary: primaryLightColor, 
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
          borderRadius: "20px", // Botones redondeados
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
          backgroundColor: "#1A1A1A", // Gris muy oscuro para las tarjetas
          border: "1px solid #E2BFD3", //
          boxShadow: "0 4px 8px rgba(226, 191, 211, 0.2)", // Sombra magenta pastel con toque de lila y más brillo
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
          borderColor: "#252525", // Divisor gris oscuro
          width: "95%",
          margin: "0 auto",
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          marginRight: "10px",
          backgroundColor: "#c2a8ff",
          color: "#000000",
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
    MuiCssBaseline: {
      styleOverrides: `
        input:-webkit-autofill,
        input:-webkit-autofill:hover, 
        input:-webkit-autofill:focus,
        textarea:-webkit-autofill,
        textarea:-webkit-autofill:hover,
        textarea:-webkit-autofill:focus,
        select:-webkit-autofill,
        select:-webkit-autofill:hover,
        select:-webkit-autofill:focus {
          -webkit-text-fill-color: ${primaryLightColor};
          -webkit-box-shadow: 0 0 0px 1000px rgba(16, 16, 16, 0.01) inset;
          transition: background-color 5000s ease-in-out 0s;
        }
      `,
    },
    MuiInputBase: {
      styleOverrides: {
        input: {
          '&:-webkit-autofill': {
            WebkitBoxShadow: '0 0 0px 1000px rgba(16, 16, 16, 0.01) inset',
            WebkitTextFillColor: primaryLightColor,
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        input: {
          '&:-webkit-autofill': {
            WebkitBoxShadow: '0 0 0px 1000px rgba(16, 16, 16, 0.01) inset',
            WebkitTextFillColor: '#ffffff',
            borderRadius: 'inherit',
          },
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

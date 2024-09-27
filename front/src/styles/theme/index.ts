import { createTheme, responsiveFontSizes } from "@mui/material";

let theme = createTheme({
  typography: {
    fontFamily: "Nunito",
    fontSize: 13,
    h1: {
      color: "#EACBDF", // Magenta pastel con toque de lila y más brillo
    },
    // ... aplicar el mismo color magenta pastel a h2-h6 ...
    body1: {
      color: "#8CCBC8", // Mantenemos el turquesa como está
      textAlign: "justify",
    },
    body2: {
      color: "#FFFFFF", // Gris medio-oscuro
      textAlign: "justify",
    },
    subtitle1: {
      color: "#E2BFD3", // Magenta pastel con toque de lila y más brillo
    },
    subtitle2: {
      color: "#FFFFFF",
    },
  },
  palette: {
    mode: "dark", // Cambiamos el modo a oscuro
    primary: {
      main: "#E2BFD3", // Magenta pastel principal con toque de lila y más brillo
      light: "#EACBDF", // Magenta claro pastel con toque de lila y más brillo
      dark: "#DAB3C7", // Magenta oscuro pastel con toque de lila y más brillo
      contrastText: "#000000", // Negro
    },
    secondary: {
      main: "#F5F5F5", // Blanco ahumado
      light: "#A0E6EC", // Turquesa más claro y brillante
      dark: "#4A9396", // Turquesa más oscuro y pastel
      contrastText: "#1A1A1A", // Gris muy oscuro para contraste (sin cambios)
    },
    background: {
      default: "#101010", // Gris muy oscuro (fondo principal)
      paper: "#151515", // Gris muy oscuro (elementos de papel)
    },
    text: {
      primary: "#FFFFFF", // Blanco
      secondary: "#8CCBC8", // Mantenemos el turquesa como está
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
          border: "1px solid #E2BFD3", // Borde magenta pastel con toque de lila y más brillo
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
          backgroundColor: "#E2BFD3", // Fondo magenta pastel con toque de lila y más brillo
          color: "#000000", // Texto negro
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
          -webkit-text-fill-color: #8CCBC8;
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
            WebkitTextFillColor: '#8CCBC8',
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

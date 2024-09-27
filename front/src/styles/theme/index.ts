import { createTheme, responsiveFontSizes } from "@mui/material";

let theme = createTheme({
  typography: {
    fontFamily: "Nunito",
    fontSize: 13,
    h1: {
      color: "#FFFFFF", // Magenta pastel ligeramente más brillante
    },
    // ... aplicar el mismo color magenta pastel a h2-h6 ...
    body1: {
      color: "#A0E6E1", // Turquesa pastel claro
      textAlign: "justify",
    },
    body2: {
      color: "#FFFFFF", // Gris medio-oscuro
      textAlign: "justify",
    },
    subtitle1: {
      color: "#FF69B4", // Magenta claro
    },
    subtitle2: {
      color: "#FFFFFF",
    },
  },
  palette: {
    mode: "dark", // Cambiamos el modo a oscuro
    primary: {
      main: "#FF9EB5", // Magenta pastel ligeramente más brillante
      light: "#FFBECF", // Magenta claro pastel
      dark: "#FF7E9D", // Magenta oscuro pastel
      contrastText: "#000000", // Negro
    },
    secondary: {
      main: "#1A1A1A", // Gris muy oscuro
      light: "#252525", // Gris oscuro
      dark: "#121212", // Gris casi negro
      contrastText: "#A0E6E1", // Turquesa pastel claro
    },
    background: {
      default: "#101010", // Gris muy oscuro (fondo principal)
      paper: "#151515", // Gris muy oscuro (elementos de papel)
    },
    text: {
      primary: "#FFFFFF", // Blanco
      secondary: "#A0E6E1", // Turquesa pastel claro
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
          border: "1px solid #FF9EB5", // Borde magenta pastel
          boxShadow: "0 4px 8px rgba(255, 158, 181, 0.15)", // Sombra magenta suave
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
          backgroundColor: "#FF9EB5", // Fondo magenta pastel
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
          -webkit-text-fill-color: #A0E6E1;
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
            WebkitTextFillColor: '#A0E6E1',
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
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiInputBase-root': {
            backgroundColor: 'transparent',
          },
          '& .MuiInputBase-input': {
            backgroundColor: 'transparent',
          },
          '& .MuiInputBase-input::placeholder': {
            color: 'rgba(255, 255, 255, 0.7)', // Ajusta el color y la opacidad según tus preferencias
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

import { createTheme, responsiveFontSizes } from "@mui/material";

const theme = createTheme({
  typography: {
    fontSize: 13,
    button: {
      textTransform: "none",
    },
    fontFamily: "Nunito",
    h6: {                     
      color: "#15163B", //"#3969AD"
    }
  },
  palette: {
    primary: {  
      main:   "#8BE067 ", 
      light:  "#A2E685",   
      dark:   "#619C48", 
    },
    secondary: {
      main: "#303287",
      light: "#546A83",
      dark: "#15163B",
    },
    info: {
      main: "#FFFFFF",
      light: "#F2F4F4",
      dark: "#F2FAFA",
    }
    
    

    //parques colombia
    /*primary: {
      main: "#3969AD",
      light: "#F6A72D",
      dark: "#F2F4F4",
    },*/ 

    /* HELPIA
    
        primary: {
      main: "#94FF7A", 
      light: "#42FF14",
      dark: "#22AD00",
    },
    secondary: {
      main: "#303287",
      dark: "#15163B",
      light: "#5A5CC4",
    },

    */

/*          primary: {
      main: "#34b1eb",
      light: "#f296eb",
      dark: "#F2F4F4",
    },  */

    /*     secondary: {
      main: "#F6A72D",
      light: "#F6A72D",
      dark: "#F6A72D",
    },
    info: {
      main: "#F6A72D",
      light: "#F6A72D",
      dark: "#F6A72D",
      contrastText: "#F6A72D",
    }, */
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
  components: {},
  transitions: {
    duration: {
      shortest: 150,
      shorter: 200,
      short: 250,
      // most basic recommended timing
      standard: 300,
      // this is to be used in complex animations
      complex: 375,
      // recommended when something is entering screen
      enteringScreen: 225,
      // recommended when something is leaving screen
      leavingScreen: 195,
    },
  },
});
export default responsiveFontSizes(theme);

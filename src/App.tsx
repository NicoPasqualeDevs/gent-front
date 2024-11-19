import theme from "@/styles/theme";
import AppRoutes from "./AppRoutes.tsx";
import { AppProvider } from "@/context";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";
import DelayedSuspense from "@/components/DelayedSuspense";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppProvider>
        <DelayedSuspense>
          <AppRoutes />
          <ToastContainer theme={"colored"} />
        </DelayedSuspense>
      </AppProvider>
    </ThemeProvider>
  );
}

export default App;

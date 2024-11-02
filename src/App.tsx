import theme from "@/styles/theme";
import React from "react";
import AppRoutes from "./AppRoutes.tsx";
import { AppProvider } from "@/context/app";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";
import LoadingFallback from "@/components/LoadingFallback";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <React.Suspense fallback={<LoadingFallback />}>
        <AppProvider>
          <AppRoutes />
          <ToastContainer theme={"colored"} />
        </AppProvider>
      </React.Suspense>
    </ThemeProvider>
  );
}

export default App;

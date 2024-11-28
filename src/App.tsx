import { Suspense, useEffect } from "react";
import theme from "@/styles/theme";
import "@/assets/fonts/ROBO.css"
import AppRoutes from "./AppRoutes.tsx";
import { AppProvider } from "@/context";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";
import LoadingFallback from "@/components/LoadingFallback";
import { useFontService } from "@/hooks/useFontService";

const AppContent = () => {
  const fontService = useFontService();

  useEffect(() => {
    // Inicializar el servicio de fuentes al montar el componente
    fontService;
  }, []);

  return (
    <Suspense fallback={<LoadingFallback />}>
      <AppRoutes />
      <ToastContainer 
        theme="colored"
        position="bottom-center"
        autoClose={1750}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </Suspense>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppProvider>
        <AppContent />
      </AppProvider>
    </ThemeProvider>
  );
}

export default App;

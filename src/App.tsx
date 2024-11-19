import { Suspense } from "react";
import theme from "@/styles/theme";
import AppRoutes from "./AppRoutes.tsx";
import { AppProvider } from "@/context";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";
import LoadingFallback from "@/components/LoadingFallback";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppProvider>
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
      </AppProvider>
    </ThemeProvider>
  );
}

export default App;

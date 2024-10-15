import { lazy } from "react";
import { Box } from "@mui/material";
import { Outlet, Routes, Route } from "react-router-dom";
import BackgroundLines from "./styles/components/BackgroundLines"; // Importamos el componente
import BuilderLayout from "./components/Layouts/Builder/BuilderLayout";
import UserLayout from "./components/Layouts/User/UserLayout";

/* import AuthChecker from "./components/AuthChecker"; */

const HomeModule = lazy(() => import("./modules/home"));
const AuthModule = lazy(() => import("./modules/auth"));
const BuilderModule = lazy(() => import("./modules/builder"));
const NotFoundModule = lazy(() => import("./modules/notFound"));

const BuilderL = (
  <BuilderLayout>
    <Outlet />
  </BuilderLayout>
);

const UserL = (
  <UserLayout>
    <Outlet />
  </UserLayout>
);

function AppRoutes() {
  return (
    <>
      <BackgroundLines />
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0, // Cambiado de height a bottom para cubrir toda la pantalla
          overflow: 'hidden',
          zIndex: -1,
          pointerEvents: 'none', // Permite que los clics pasen a través de la nieve
        }}
      >
      </Box>
      <Routes>
        <Route path="/">
          <Route path="auth/*" element={<AuthModule />} />
          <Route path="builder/*" element={BuilderL}>
            <Route path="*" element={<BuilderModule />} />
          </Route>
          <Route path="" element={UserL}>
            <Route index element={<HomeModule />} />
          </Route>
          <Route path="*" element={<NotFoundModule />} />
        </Route>
      </Routes>
    </>
  );
}

export default AppRoutes;

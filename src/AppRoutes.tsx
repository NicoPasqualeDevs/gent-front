import { lazy } from "react";
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

function AppRoutes() {  // Cambiado de App a AppRoutes
  return (
    /*  <AuthChecker> */
    <>
      <BackgroundLines /> {/* Agregamos el componente BackgroundLines */}
      <Routes>
        <Route path="/">
          {/* USER AUTH ROUTES */}
          <Route index path="/auth/*" element={<AuthModule />} />
          {/* BUILDER ROUTES */}
          <Route path="/builder/*" element={BuilderL}>
            <Route index element={<BuilderModule />} />
          </Route>
          {/* USERS PANEL ROUTES */}
          <Route path="/" element={<HomeModule />} />
          {/* NOT FOUND ROUTE */}
          <Route path="*" element={<NotFoundModule />} /> 
        </Route>
      </Routes>
      <Routes>
      </Routes>
    </>
    /*     </AuthChecker> */
  );
}

export default AppRoutes;

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

function AppRoutes() {
  return (
    <>
      <BackgroundLines />
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

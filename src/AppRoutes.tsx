import { lazy, Suspense, ReactNode } from "react";
import { Box } from "@mui/material";
import { Outlet, Routes, Route, Navigate } from "react-router-dom";
import BackgroundLines from "./styles/components/BackgroundLines";
import BuilderLayout from "./components/Layouts/Builder/BuilderLayout";
import UserLayout from "./components/Layouts/User/UserLayout";
import { PageCircularProgress } from "@/components/CircularProgress";
import AuthChecker from "./components/AuthChecker";
import { useAppContext } from '@/context/app';
import { useLocation } from 'react-router-dom';

// Interfaces
interface ProtectedRouteProps {
  children: ReactNode;
  requireAuth?: boolean;
}

// Lazy loaded components
const HomeModule = lazy(() => import("./modules/home"));
const AuthModule = lazy(() => import("./modules/auth"));
const BuilderModule = lazy(() => import("./modules/builder"));
const NotFoundModule = lazy(() => import("./modules/notFound"));

// Layout components with Suspense
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

// Protected Route Component
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireAuth = true }) => {
  const { auth } = useAppContext();
  const location = useLocation();

  if (requireAuth && !auth?.token) {
    // Redirigir a login si se requiere autenticación y no hay token
    return <Navigate to="/auth/login" state={{ from: location.pathname }} replace />;
  }

  if (!requireAuth && auth?.token) {
    // Redirigir a builder si ya está autenticado y trata de acceder a rutas públicas
    return <Navigate to="/builder" replace />;
  }

  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <>
      <BackgroundLines />
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          overflow: 'hidden',
          zIndex: -1,
          pointerEvents: 'none',
        }}
      />
      <Suspense fallback={<PageCircularProgress />}>
        <Routes>
          <Route path="/">
            <Route 
              path="auth/*" 
              element={
                <ProtectedRoute requireAuth={false}>
                  <AuthModule />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="builder/*" 
              element={
                <ProtectedRoute>
                  <BuilderLayout>
                    <BuilderModule />
                  </BuilderLayout>
                </ProtectedRoute>
              }
            />
            <Route 
              path="home" 
              element={
                <ProtectedRoute>
                  {UserL}
                </ProtectedRoute>
              }
            >
              <Route index element={<HomeModule />} />
            </Route>
            <Route index element={<Navigate to="/home" replace />} />
            <Route path="*" element={<NotFoundModule />} />
          </Route>
        </Routes>
      </Suspense>
    </>
  );
}

export default AppRoutes;

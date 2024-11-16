import React, { lazy, ReactNode } from "react";
import { Box } from "@mui/material";
import { Outlet, Routes, Route, Navigate, BrowserRouter } from "react-router-dom";
import BackgroundLines from "./styles/components/BackgroundLines";
import BuilderLayout from "./components/Layouts/Builder/BuilderLayout";
import UserLayout from "./components/Layouts/User/UserLayout";
import { useAppContext } from '@/context';
import { useLocation } from 'react-router-dom';

// Interfaces
interface ProtectedRouteProps {
  children: ReactNode;
  requireAuth?: boolean;
}

// Lazy loaded components sin Suspense individual
const HomeModule = lazy(() => import("./modules/home"));
const BuilderModule = lazy(() => import("./modules/builder"));
const NotFoundModule = lazy(() => import("./modules/notFound"));
const AuthModule = lazy(() => import("./modules/auth"));
const ChatViewModule = lazy(() => import("./modules/chatView"));

// Layout components
const UserL = (
  <UserLayout>
    <Outlet />
  </UserLayout>
);

// Protected Route Component
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireAuth = true }) => {
  const { auth, replacePath } = useAppContext();
  const location = useLocation();

  // Si requireAuth es true y no hay auth, redirigir a login
  if (requireAuth && !auth?.token) {
    return <Navigate to="/auth/login" state={{ from: location.pathname }} replace />;
  }

  // Si requireAuth es false y hay auth, redirigir a builder sin establecer navegación
  if (!requireAuth && auth?.token) {
    replacePath([]); // Limpiamos la navegación
    return <Navigate to="/builder" replace />;
  }

  return <>{children}</>;
};

const AppRoutes = () => {
  const { replacePath } = useAppContext();

  // Aseguramos que la navegación esté limpia al montar las rutas
  React.useEffect(() => {
    replacePath([]);
  }, []);

  return (
    <BrowserRouter>
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
            path="chat/*"
            element={
              <ProtectedRoute>
                <ChatViewModule />
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
          <Route index element={<Navigate to="/builder" replace />} />
          <Route path="*" element={<NotFoundModule />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;

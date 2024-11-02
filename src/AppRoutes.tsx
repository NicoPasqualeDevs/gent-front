import React, { lazy, ReactNode } from "react";
import { Box } from "@mui/material";
import { Outlet, Routes, Route, Navigate } from "react-router-dom";
import BackgroundLines from "./styles/components/BackgroundLines";
import BuilderLayout from "./components/Layouts/Builder/BuilderLayout";
import UserLayout from "./components/Layouts/User/UserLayout";
import { useAppContext } from '@/context/app';
import { useLocation } from 'react-router-dom';
import DelayedSuspense from '@/components/DelayedSuspense';
import { authStorage } from "@/services/auth";

// Interfaces
interface ProtectedRouteProps {
  children: ReactNode;
  requireAuth?: boolean;
}

// Lazy loaded components
const HomeModule = lazy(() => import("./modules/home"));
const BuilderModule = lazy(() => import("./modules/builder"));
const NotFoundModule = lazy(() => import("./modules/notFound"));
const AuthModule = lazy(() => import("./modules/auth"));

// Layout components with Suspense
const UserL = (
  <UserLayout>
    <Outlet />
  </UserLayout>
);

// Protected Route Component
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireAuth = true }) => {
  const { auth, setAuth } = useAppContext();
  const { getAuth } = authStorage();
  const location = useLocation();

  React.useEffect(() => {
    if (requireAuth && !auth?.token) {
      const savedAuth = getAuth();
      if (savedAuth?.token) {
        setAuth(savedAuth);
      }
    }
  }, [auth, requireAuth, setAuth]);

  if (requireAuth && !auth?.token) {
    return <Navigate to="/auth/login" state={{ from: location.pathname }} replace />;
  }

  if (!requireAuth && auth?.token) {
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
      <DelayedSuspense>
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
      </DelayedSuspense>
    </>
  );
}

export default AppRoutes;

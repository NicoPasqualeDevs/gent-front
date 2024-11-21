import React, { lazy, ReactNode, useState, useEffect } from "react";
import { Box } from "@mui/material";
import { Outlet, Routes, Route, Navigate } from "react-router-dom";
import BackgroundLines from "./styles/components/BackgroundLines";
import BuilderLayout from "./components/Layouts/Builder/BuilderLayout";
import UserLayout from "./components/Layouts/User/UserLayout";
import { useAppContext } from '@/context';
import { useLocation } from 'react-router-dom';
import LoadingFallback from "@/components/LoadingFallback";

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
const ProfileView = lazy(() => import("./pages/Home/Main/User/Profile/View"));
const ProfileEdit = lazy(() => import("./pages/Home/Main/User/Profile/Edit"));

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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingFallback />;
  }

  if (requireAuth && !auth?.token) {
    return <Navigate to="/auth/login" state={{ from: location.pathname }} replace />;
  }

  if (!requireAuth && auth?.token) {
    replacePath([]);
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
          <Route 
            path="profile" 
            element={
              <ProtectedRoute>
                {UserL}
              </ProtectedRoute>
            }
          >
            <Route index element={<ProfileView />} />
            <Route path="edit" element={<ProfileEdit />} />
          </Route>
          <Route index element={<Navigate to="/builder" replace />} />
          <Route path="*" element={<NotFoundModule />} />
        </Route>
      </Routes>
    </>
  );
}

export default AppRoutes;

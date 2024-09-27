import { lazy } from "react";
import { Routes, Route } from "react-router-dom";
import BackgroundLines from "./styles/components/BackgroundLines"; // Importamos el componente

const HomeModule = lazy(() => import("./modules/home"));
const AuthModule = lazy(() => import("./modules/auth"));
const BotsDetailsModule = lazy(() => import("./modules/bots"));
const ClientsModule = lazy(() => import("./modules/clients"));
const ChatViewModule = lazy(() => import("./modules/chatView"));
const NotFoundModule = lazy(() => import("./modules/notFound")); // Asumiendo que existe
const ProfileModule = lazy(() => import("./modules/profile")); // Nuevo módulo

function AppRoutes() {  // Cambiado de App a AppRoutes
  return (
    <>
      <BackgroundLines /> {/* Agregamos el componente BackgroundLines */}
      <Routes>
        <Route path="/" element={<HomeModule />} />
        <Route path="/bots/*" element={<BotsDetailsModule />} />
        <Route path="/clients/*" element={<ClientsModule />} />
        <Route path="/auth/*" element={<AuthModule />} />
        <Route path="/bots/chat/:botId" element={<ChatViewModule />} />
        <Route path="/profile/*" element={<ProfileModule />} /> // Nueva ruta
        <Route path="*" element={<NotFoundModule />} /> // Ruta para manejar 404
      </Routes>
    </>
  );
}

export default AppRoutes;

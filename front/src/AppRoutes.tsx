import { lazy } from "react";
import { Routes, Route } from "react-router-dom";
import AuthChecker from "./components/AuthChecker";

const HomeModule = lazy(() => import("./modules/home"));
const AuthModule = lazy(() => import("./modules/auth"));
const BotsDetailsModule = lazy(() => import("./modules/bots"));
const ClientsModule = lazy(() => import("./modules/clients"));
const ChatViewModule = lazy(() => import("./modules/chatView"));
//const KnowledgeBaseModule = lazy(() => import("./modules/knowledgeBase"));

function App() {
  return (
    <AuthChecker>
      <Routes>
        <Route path={"/*"} index element={<HomeModule />} />
        <Route path={"/bots/*"} index element={<BotsDetailsModule />} />
        <Route path={"/clients/*"} index element={<ClientsModule />} />
        <Route path={"/auth/*"} element={<AuthModule />} />
        <Route path={"/bots/chat/:botId"} element={<ChatViewModule />} />
      </Routes>
    </AuthChecker>
  );
}

export default App;

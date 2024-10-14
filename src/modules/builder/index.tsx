import React from "react";
import { lazy } from "react";
import { Route, Routes } from "react-router-dom";
import AuthChecker from "@/components/AuthChecker";
import AiTeamsList from "@/pages/AiTeams/AiTeamsList";
import AiTeamsForm from "@/pages/AiTeams/AiTeamsForm";

const AgentsDetailsModule = lazy(() => import("./agents"));
const ChatViewModule = lazy(() => import("../../modules/chatView"));
const ProfileModule = lazy(() => import("../../modules/profile")); // Nuevo módulo

const AiTeamsModule: React.FC = () => {
  return (
    <AuthChecker>
      <Routes>
        <Route path='/'>
          {/* AI TEAMS */}
          <Route index element={<AiTeamsList />} />
          <Route path="form/:clientName?/:clientId?" element={<AiTeamsForm />} />
          <Route path="agents/chat/:botId" element={<ChatViewModule />} />
          <Route path="profile/*" element={<ProfileModule />} />
          {/* AGENTS DETAILS*/}
          <Route path="agents/*" element={<AgentsDetailsModule />} />
        </Route>
      </Routes>
    </AuthChecker>
  );
};

export default AiTeamsModule;

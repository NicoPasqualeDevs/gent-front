import React from "react";
import { lazy } from "react";
import { Route, Routes } from "react-router-dom";
import AuthChecker from "@/components/AuthChecker";
import AiTeamsList from "@/pages/AiTeams/AiTeamsList";
import AiTeamsForm from "@/pages/AiTeams/AiTeamsForm";
import ToolsForm from "@/pages/Builder/ToolsForm/Admin";

const AgentsDetailsModule = lazy(() => import("./agents"));
const ProfileModule = lazy(() => import("../../modules/profile")); // Nuevo módulo

const AiTeamsModule: React.FC = () => {
  return (
    <AuthChecker>
      <Routes>
        <Route path='/'>
          {/* AI TEAMS */}
          <Route index element={<AiTeamsList />} />
          <Route path="form/:aiTeamName?/:aiTeamId?" element={<AiTeamsForm />} />
          <Route path="profile/*" element={<ProfileModule />} />
          {/* AGENTS DETAILS*/}
          <Route path="agents/*" element={<AgentsDetailsModule />} />
          {/* ADMIN TOOLS */}
          <Route
            path="admin-tools-form"
            element={<ToolsForm />}
          />
        </Route>
      </Routes>
    </AuthChecker>
  );
};

export default AiTeamsModule;

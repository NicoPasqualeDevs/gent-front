import React from "react";
import { Outlet, Route, Routes } from "react-router-dom";
import AuthChecker from "@/components/AuthChecker";
import AiTeamsList from "@/pages/AiTeams/AiTeamsList";
import AppLayout from "@/components/Layout/AppLayout";
import AiTeamsForm from "@/pages/AiTeams/AiTeamsForm";

const Layout = (
  <AppLayout>
    <Outlet />
  </AppLayout>
);

const AiTeamsModule: React.FC = () => {
  return (
    <AuthChecker>
      <Routes>
        <Route path="/" element={Layout}>
          <Route index element={<AiTeamsList />} />
          <Route path="form/:clientName?/:clientId?" element={<AiTeamsForm />} />
        </Route>
      </Routes>
    </AuthChecker>
  );
};

export default AiTeamsModule;

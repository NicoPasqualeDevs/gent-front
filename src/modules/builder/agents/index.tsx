import React from "react";
import { Route, Routes } from "react-router-dom";
import AuthChecker from "@/components/AuthChecker";
import AgentsList from "@/pages/Builder/Agents/List";
import { WidgetCustomizer } from "@/pages/Builder/WidgetCustomizer";
import AgentForm from "@/pages/Builder/Agents/Form";
import Tools from "@/pages/Builder/Tools";
import ToolsForm from "@/pages/Builder/ToolsForm/Admin";
import ToolsRelation from "@/pages/Builder/ToolsRelation";

const AgentsDetailsModule: React.FC = () => {
  return (
    <AuthChecker>
      <Routes>
        {/* Rutas principales */}
        <Route path=":clientName/:teamId" element={<AgentsList />} />
        <Route path="contextEntry/:teamId/:agentId?" element={<AgentForm />} />
        <Route path="widgetCustomizer/:agentId" element={<WidgetCustomizer />} />

        {/* Rutas de herramientas */}
        <Route path="tools">
          <Route path=":teamId/:clientName/:agentId" element={<Tools />} />
          <Route path="form/:teamId/:agentId/:toolId?" element={<ToolsForm />} />
          <Route path="Relation/:teamId/:agentId" element={<ToolsRelation />} />
        </Route>
      </Routes>
    </AuthChecker>
  );
};

export default AgentsDetailsModule;

import React from "react";
import { Route, Routes } from "react-router-dom";
import AgentsList from "@/pages/Builder/Agents/List";
import { WidgetCustomizer } from "@/pages/Builder/WidgetCustomizer";
import AgentForm from "@/pages/Builder/Agents/Form";
import Tools from "@/pages/Builder/Tools";
import ToolsForm from "@/pages/Builder/ToolsForm/Admin";
import ToolsRelation from "@/pages/Builder/ToolsRelation";
import TestAgent from "@/pages/Builder/TestAgent";
import { Knowledge } from "@/pages/Builder/Knowledge";

const AgentsDetailsModule: React.FC = () => {
  return (
      <Routes>
        {/* Rutas principales */}
        <Route path=":teamName/:teamId" element={<AgentsList />} />
        <Route path="contextEntry/:teamId/:agentId?" element={<AgentForm />} />
        <Route path="widgetCustomizer/:agentId" element={<WidgetCustomizer />} />
        
        {/* Nueva ruta para Knowledge */}
        <Route path="knowledge/:agentId" element={<Knowledge />} />

        {/* Nueva ruta para Test */}
        <Route path="test/:agentId" element={<TestAgent />} />

        {/* Rutas de herramientas */}
        <Route path="tools">
          <Route path=":teamId/:clientName/:agentId" element={<Tools />} />
          <Route path="form/:teamId/:agentId/:toolId?" element={<ToolsForm />} />
          <Route path="relation/:teamId/:agentId" element={<ToolsRelation />} />
        </Route>
      </Routes>
  );
};

export default AgentsDetailsModule;

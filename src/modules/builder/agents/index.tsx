import React from "react";
import { Route, Routes } from "react-router-dom";
import AuthChecker from "@/components/AuthChecker";
import IaPanel from "@/pages/Builder/IaPanel";
import { WidgetCustomizer } from "@/pages/Builder/WidgetCustomizer";
import ContextEntry from "@/pages/Builder/ContextEntry";
import Tools from "@/pages/Builder/Tools";
import ToolsForm from "@/pages/Builder/ToolsForm/Admin";
import ToolsRelationship from "@/pages/Builder/ToolsRelationship";

const AgentsDetailsModule: React.FC = () => {
  return (
    <AuthChecker>
      <Routes>
        {/* Rutas principales */}
        <Route path=":clientName/:aiTeamId" element={<IaPanel />} />
        <Route path="contextEntry/:aiTeamId/:botId?" element={<ContextEntry />} />
        <Route path="widgetCustomizer/:botId" element={<WidgetCustomizer />} />

        {/* Rutas de herramientas */}
        <Route path="tools">
          <Route path=":aiTeamId/:botId/:toolId?" element={<Tools />} />
          <Route path="form/:aiTeamId/:botId/:toolId?" element={<ToolsForm />} />
          <Route path="relationship/:aiTeamId/:botId" element={<ToolsRelationship />} />
        </Route>
      </Routes>
    </AuthChecker>
  );
};

export default AgentsDetailsModule;

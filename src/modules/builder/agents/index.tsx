import React, { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import AuthChecker from "@/components/AuthChecker";
import LoadingFallback from "@/components/LoadingFallback";
import DataEntryComponent from "@/pages/Builder/DataEntry";
import IaPanel from "@/pages/Builder/IaPanel";
import { WidgetCustomizer } from "@/pages/Builder/WidgetCustomizer";
import ContextEntry from "@/pages/Builder/ContextEntry";
import Tools from "@/pages/Builder/Tools";
import ToolsForm from "@/pages/Builder/ToolsForm/Admin";
import ToolsRelationship from "@/pages/Builder/ToolsRelationship";

const AgentsDetailsModule: React.FC = () => {
  return (
    <AuthChecker>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="contextEntry/:aiTeamId?/:botId?" element={<ContextEntry />} />
          <Route path="dataEntry/:botId?" element={<DataEntryComponent />} />
          <Route path="widgetCustomizer/:botId?" element={<WidgetCustomizer />} />
          <Route path="tools/:aiTeamId?/:botName?/:botId?/:toolName?/:toolId?" element={<Tools />} />
          <Route path="tools-form/:aiTeamId?/:botName?/:botId?/:toolName?/:toolId?" element={<ToolsForm />} />
          <Route path="tools-relationship/:botName?/:botId?" element={<ToolsRelationship />} />
          <Route path=":clientName/:aiTeamId" element={<IaPanel />} />
        </Routes>
      </Suspense>
    </AuthChecker>
  );
};

export default AgentsDetailsModule;

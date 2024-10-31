import React from "react";
import { Route, Routes } from "react-router-dom";
import AuthChecker from "@/components/AuthChecker";
import DataEntryComponent from "@/pages/Builder/DataEntry";
import IaPanel from "@/pages/Builder/IaPanel";
import { WidgetCustomizer } from "@/pages/Builder/WidgetCustomizer";
import CustomMessages from "@/pages/Builder/CustomMessages";
import ContextEntry from "@/pages/Builder/ContextEntry";
import Tools from "@/pages/Builder/Tools";
import ToolsForm from "@/pages/Builder/ToolsForm/Admin";
import ToolsRelationship from "@/pages/Builder/ToolsRelationship";

const AgentsDetailsModule: React.FC = () => {
  return (
    <AuthChecker>
      <Routes>
        <Route index path=":clientName/:aiTeamId" element={<IaPanel />} />
        <Route
          path="contextEntry/:aiTeamId?/:botId?"
          element={<ContextEntry />}
        />
        <Route path="dataEntry/:botId?" element={<DataEntryComponent />} />
{/*         <Route
          path="widgetCustomizer/:botId?"
          element={<WidgetCustomizer />}
        /> */}
        <Route path="widgetCustomizer/:botId?" element={<WidgetCustomizer />} />
        <Route path="tools/:aiTeamId?/:botName?/:botId?/:toolName?/:toolId?" element={<Tools />} />
        <Route
          path="tools-form/:aiTeamId?/:botName?/:botId?/:toolName?/:toolId?" 
          element={<ToolsForm />}
        />
        <Route path="tools-relationship/:botName?/:botId?" element={<ToolsRelationship />} />

      </Routes>
    </AuthChecker>
  );
};

export default AgentsDetailsModule;

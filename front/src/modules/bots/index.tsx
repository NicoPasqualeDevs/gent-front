import React from "react";
import { Outlet, Route, Routes } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import AuthChecker from "@/components/AuthChecker";
import DataEntryComponent from "@/components/pages/Bots/DataEntry";
import IaPanel from "@/components/pages/Bots/IaPanel";
import { WidgetCustomizer } from "@/components/pages/Bots/WidgetCustomizer";
import CustomMessages from "@/components/pages/Bots/CustomMessages";
import ContextEntry from "@/components/pages/Bots/ContextEntry";
import Tools from "@/components/pages/Bots/Tools";
import ToolsForm from "@/components/pages/Bots/ToolsForm";
import ToolsRelationship from "@/components/pages/Bots/ToolsRelationship";



const Layout = (
  <AppLayout>
    <Outlet />
  </AppLayout>
);

const BotsDetailsModule: React.FC = () => {
  return (
    <AuthChecker>
      <Routes>
        <Route path="/" element={Layout}>
          <Route path="iaPanel/:clientName/:clientId" element={<IaPanel />} />
          <Route
            path="contextEntry/:clientId?/:botId?"
            element={<ContextEntry />}
          />
          <Route path="dataEntry/:botId?" element={<DataEntryComponent />} />
          <Route
            path="widgetCustomizer/:botId?"
            element={<WidgetCustomizer />}
          />
          <Route path="customMessages/:botId?" element={<CustomMessages />} />
          <Route path="tools/:botName?/:botId?" element={<Tools />} />
          <Route
            path="tools-form/:toolName?/:toolId?"
            element={<ToolsForm />}
          />
          <Route path="tools-relationship/:botName?/:botId?" element={<ToolsRelationship/>}/>
        </Route>
      </Routes>
    </AuthChecker>
  );
};

export default BotsDetailsModule;

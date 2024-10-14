import React from "react";
import { Outlet, Route, Routes } from "react-router-dom";
import AppLayout from "@/components/Layout/AppLayout";
import AuthChecker from "@/components/AuthChecker";
import DataEntryComponent from "@/components/pages/Builder/DataEntry";
import IaPanel from "@/components/pages/Builder/IaPanel";
import { WidgetCustomizer } from "@/components/pages/Builder/WidgetCustomizer";
import CustomMessages from "@/components/pages/Builder/CustomMessages";
import ContextEntry from "@/components/pages/Builder/ContextEntry";
import Tools from "@/components/pages/Builder/Tools";
import ToolsForm from "@/components/pages/Builder/ToolsForm";
import ToolsRelationship from "@/components/pages/Builder/ToolsRelationship";



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

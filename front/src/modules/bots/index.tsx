import React from "react";
import { Outlet, Route, Routes } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import AuthChecker from "@/components/AuthChecker";
import DataEntryComponent from "@/components/pages/Bots/DataEntry";
import IaPanel from "@/components/pages/Bots/IaPanel";
import { WidgetCustomizer } from "@/components/pages/Bots/WidgetCustomizer";
import CustomMessages from "@/components/pages/Bots/CustomMessages";
import ContextEntry from "@/components/pages/Bots/ContextEntry";

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
        </Route>
      </Routes>
    </AuthChecker>
  );
};

export default BotsDetailsModule;

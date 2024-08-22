import React from "react";
import { Outlet, Route, Routes } from "react-router-dom";
//import ClientList from "@/components/pages/Clients/ClientList";
import AppLayout from "@/components/layout/AppLayout";
//import AuthChecker from "@/components/AuthChecker";
//import ClientsListDataSet from "@/context/DataSets/ClientsList";
import DataEntryComponent from "@/components/pages/Bots/DataEntry";
import ContextEntryComponent from "@/components/pages/Bots/ContextEntry";
import IaPanel from "@/components/pages/Bots/IaPanel";

const Layout = (
  <AppLayout>
    <Outlet />
  </AppLayout>
);

const BotsDetailsModule: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={Layout}>
        <Route path="iaPanel/:clientId?" element={<IaPanel />} />
        <Route
          path="contextEntry/:clientId?/:botId?"
          element={<ContextEntryComponent />}
        />
        <Route path="dataEntry/:botId?" element={<DataEntryComponent />} />
      </Route>
    </Routes>
  );
};

export default BotsDetailsModule;

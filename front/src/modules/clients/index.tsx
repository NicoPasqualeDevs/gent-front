import React from "react";
import { Outlet, Route, Routes } from "react-router-dom";
import AuthChecker from "@/components/AuthChecker";
import ClientForm from "@/components/pages/Clients/ClientForm";
import ClientList from "@/components/pages/Clients/ClientList";
import AppLayout from "@/components/layout/AppLayout";

const Layout = (
  <AppLayout>
    <Outlet />
  </AppLayout>
);

const ClientsModule: React.FC = () => {
  return (
    <AuthChecker>
      <Routes>
        <Route path="/" element={Layout}>
          <Route index element={<ClientList />} />
          <Route path="form/:clientId?" element={<ClientForm />} />
        </Route>
      </Routes>
    </AuthChecker>
  );
};

export default ClientsModule;

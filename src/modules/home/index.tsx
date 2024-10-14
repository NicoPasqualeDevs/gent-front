import React from "react";
import Home from "../../pages/Home";
import { Outlet, Route, Routes } from "react-router-dom";
import AuthChecker from "@/components/AuthChecker";
import AppLayout from "@/components/Layout/AppLayout";

const Layout = (
  <AppLayout>
    <Outlet />
  </AppLayout>
);

const HomeModule: React.FC = () => {
  return (
    <AuthChecker>
      <Routes>
        <Route path="/" element={Layout}>
          <Route index element={<Home />} />
        </Route>
      </Routes>
    </AuthChecker>
  );
};

export default HomeModule;

import React from "react";
import Home from "../../components/pages/Home/index.tsx";
import AuthChecker from "@/components/AuthChecker/index.tsx";
import { Outlet, Route, Routes } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout.tsx";

const Layout = (
  <AppLayout>
    <Outlet />
  </AppLayout>
);

const HomeModule: React.FC = () => {
  return (
    <AuthChecker>
      <Routes>
        <Route path={"/"} element={Layout}>
          <Route index element={<Home />} />
        </Route>
      </Routes>
    </AuthChecker>
  );
};

export default HomeModule;

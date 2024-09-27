import React from "react";
import Home from "../../components/pages/Home/index.tsx";
import AuthChecker from "@/components/AuthChecker/index.tsx";
import { Route, Routes } from "react-router-dom";

const HomeModule: React.FC = () => {
  return (
    <AuthChecker>
      <Routes>
          <Route index element={<Home />} />
      </Routes>
    </AuthChecker>
  );
};

export default HomeModule;

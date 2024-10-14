import React from "react";
import Home from "../../pages/Home";
import { Route, Routes } from "react-router-dom";
import AuthChecker from "@/components/AuthChecker";

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

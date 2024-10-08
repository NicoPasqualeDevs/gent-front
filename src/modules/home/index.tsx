import React from "react";
import Home from "../../components/pages/Home/index.tsx";
import { Route, Routes } from "react-router-dom";

const HomeModule: React.FC = () => {
  return (
    <>
      <Routes>
          <Route index element={<Home />} />
      </Routes>
    </>
  );
};

export default HomeModule;

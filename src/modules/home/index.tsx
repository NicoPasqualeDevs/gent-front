import React from "react";
import Home from "../../pages/Home";
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

import React from "react";
import { Route, Routes } from "react-router-dom";
import Widget from "@/components/pages/Bots/Widget";

const ChatViewModule: React.FC = () => {
  return (
    <Routes>
      <Route path={"/"}>
        <Route index element={<Widget />} />
      </Route>
    </Routes>
  );
};

export default ChatViewModule;

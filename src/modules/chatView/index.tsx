import React from "react";
import { Route, Routes } from "react-router-dom";
import ChatView from "@/pages/Builder/ChatView";

const ChatViewModule: React.FC = () => {
  return (
    <Routes>
      <Route path={"/"}>
        <Route index element={<ChatView />} />
      </Route>
    </Routes>
  );
};

export default ChatViewModule;

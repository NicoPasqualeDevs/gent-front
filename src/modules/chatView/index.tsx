import React from "react";
import { Route, Routes } from "react-router-dom";
import ChatView from "@/pages/Builder/ChatView";

const ChatViewModule: React.FC = () => {
  return (
    <Routes>
      <Route path="/:botId" element={<ChatView />} />
    </Routes>
  );
};

export default ChatViewModule;

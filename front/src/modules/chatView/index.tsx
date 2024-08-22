import React from "react";
import ChatView from "@/components/pages/Bots/ChatView";
import { Route, Routes } from "react-router-dom";


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

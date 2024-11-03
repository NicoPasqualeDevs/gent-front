import React from "react";
import { Route, Routes } from "react-router-dom";
import AuthChecker from "@/components/AuthChecker";
import ProfileEdit from "../../pages/Home/Main/User/Profile/Edit";
import ProfileView from "../../pages/Home/Main/User/Profile/View";

const ProfileModule: React.FC = () => {
  return (
    <AuthChecker>
      <Routes>
        <Route path="/">
          <Route index element={<ProfileView />} />
          <Route path="edit" element={<ProfileEdit />} />
        </Route>
      </Routes>
    </AuthChecker>
  );
};

export default ProfileModule;

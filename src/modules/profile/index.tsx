import React from "react";
import { Outlet, Route, Routes } from "react-router-dom";
import AuthChecker from "@/components/AuthChecker";
import ProfileView from "@/pages/Profile/View";
import ProfileEdit from "@/pages/Profile/Edit";
import AppLayout from "@/components/Layout/AppLayout";

const Layout = (
  <AppLayout>
    <Outlet />
  </AppLayout>
);

const ProfileModule: React.FC = () => {
  return (
    <AuthChecker>
      <Routes>
        <Route path="/" element={Layout}>
          <Route index element={<ProfileView />} />
          <Route path="edit" element={<ProfileEdit />} />
        </Route>
      </Routes>
    </AuthChecker>
  );
};

export default ProfileModule;

import React, { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import AuthChecker from "@/components/AuthChecker";
import LoadingFallback from "@/components/LoadingFallback";
import ProfileEdit from "../../pages/Home/Main/User/Profile/Edit";
import ProfileView from "../../pages/Home/Main/User/Profile/View";

const ProfileModule: React.FC = () => {
  return (
    <AuthChecker>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/">
            <Route index element={<ProfileView />} />
            <Route path="edit" element={<ProfileEdit />} />
          </Route>
        </Routes>
      </Suspense>
    </AuthChecker>
  );
};

export default ProfileModule;

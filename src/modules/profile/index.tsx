import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import AuthChecker from "@/components/AuthChecker";
import ProfileEdit from "@/pages/Home/Main/User/Profile/Edit";
import ProfileView from "@/pages/Home/Main/User/Profile/View";
import { useAppContext } from "@/context";
import useLoadingState from '@/hooks/useLoadingState';

const ProfileModule: React.FC = () => {
  const { language, replacePath, setNavElevation } = useAppContext();
  const { resetState } = useLoadingState();

  useEffect(() => {
    const initializeModule = () => {
      setNavElevation('profile');
      replacePath([
        {
          label: "Perfil",
          current_path: "/profile",
          preview_path: "",
          translationKey: "profile"
        }
      ]);
      resetState();
    };

    initializeModule();
  }, [language, replacePath, setNavElevation, resetState]);

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

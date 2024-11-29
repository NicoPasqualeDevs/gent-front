import React, { useEffect } from "react";
import UserPanel from "./Main/User/Panel";
import { useAppContext } from '@/context';

const HomeComponent: React.FC = () => {
  const { auth } = useAppContext();

  useEffect(() => {
    if (auth) {
      console.log("User data loaded", { user: auth });
    }
  }, [auth]);

  return (
    <UserPanel />
  );
};

export default HomeComponent;

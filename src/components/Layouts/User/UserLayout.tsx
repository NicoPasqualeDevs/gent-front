import React from "react";
import LeftMenu from "./LeftMenu";
import RightMenu from "./RightMenu";

interface ComponentProps {
  children: React.ReactNode;
}

const UserLayout: React.FC<ComponentProps> = ({ children }) => {
  return (
    <>
      {/*    <Header /> */}
      <LeftMenu />
      <RightMenu />
      {children}
    </>
  );
};

export default UserLayout;

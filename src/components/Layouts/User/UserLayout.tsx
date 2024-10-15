import React from "react";
import LeftMenu from "./LeftMenu";
import Header from "./Header";
import { Grid, Stack } from "@mui/material";
import { MainContent } from "../../StyledComponents/Layout";

interface ComponentProps {
  children: React.ReactNode;
}

const UserLayout: React.FC<ComponentProps> = ({ children }) => {
  return (
    <>
   {/*    <Header /> */}

            {children}

    </>
  );
};

export default UserLayout;

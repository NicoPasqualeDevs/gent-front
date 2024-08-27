import React, { useEffect } from "react";
import LeftMenu from "./LeftMenu";
import { useAppContext } from "@/context/app";
import ShortHeader from "./ShortHeader";

interface ComponentProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<ComponentProps> = ({ children }) => {
  const {
    layout: { breakpoint },
  } = useAppContext();

  useEffect(() => {
    if (breakpoint) {
      console.log(breakpoint, "<-- breakpoint");
    }
  }, [breakpoint]);

  return (
    <>
      {breakpoint === "xl" || breakpoint === "lg" ? (
        <>
          <LeftMenu />
          {children}
        </>
      ) : (
        <>
          <ShortHeader />
          {children}
        </>
      )}
    </>
  );
};

export default AppLayout;

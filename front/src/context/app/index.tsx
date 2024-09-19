import React, { useContext, useReducer } from "react";
import { AppContext, AppContextState, INITIAL_STATE } from "./AppContext.ts";
import { AppReducer } from "./AppReducer.ts";
import { useWidth } from "@/hooks/useWidth.ts";
import { isWidthDown } from "@mui/material/Hidden/withWidth";
import { AuthUser } from "@/types/Auth.ts";
import { ClientDetails } from "@/types/Clients.ts";
import { PathData } from "@/types/Pathbar.ts";

interface AppProviderProps {
  children: React.ReactNode | Array<React.ReactNode>;
}

export const AppProvider = ({ children }: AppProviderProps) => {
  const [
    {
      menu,
      layout,
      loaded,
      clientsList,
      auth,
      navElevation,
      appNavigation,
      clientPage,
      toolsPage,
      botToolsPage,
      agentsPage,
    },
    dispatch,
  ] = useReducer(AppReducer, INITIAL_STATE);

  const width = useWidth();
  React.useEffect(() => {
    dispatch({ type: "setBreakPoint", payload: width });

    if (isWidthDown("sm", width)) {
      dispatch({ type: "setDevice", payload: "mobile" });
    } else if (isWidthDown("md", width)) {
      dispatch({ type: "setDevice", payload: "tablet" });
    } else {
      dispatch({ type: "setDevice", payload: "pc" });
    }
  }, [width]);

  const setAuthUser = (value: AuthUser | null) => {
    dispatch({ type: "setAuthUser", payload: value });
  };
  const setLogin = (value: AuthUser) => {
    dispatch({ type: "setAuthUser", payload: value });
  };

  const setLoaded = (value: boolean) => {
    dispatch({ type: "setLoaded", payload: value });
  };

  const setCustomersList = (value: ClientDetails[]) => {
    dispatch({ type: "setCustomersList", payload: value });
  };

  const setMenu = (value: boolean) => {
    dispatch({ type: "setMenu", payload: value });
  };

  const setNavElevation = (value: string) => {
    dispatch({ type: "setNavElevation", payload: value });
  };

  const setAppNavigation = (value: PathData) => {
    dispatch({ type: "setAppNavigation", payload: value });
  };

  const replacePath = (value: PathData[]) => {
    dispatch({ type: "replacePath", payload: value });
  };

  const cleanState = () => {
    dispatch({ type: "cleanState" });
  };

  const setClientPage = (value: number) => {
    dispatch({ type: "setClientPage", payload: value });
  };

  const setToolsPage = (value: number) => {
    dispatch({ type: "setToolsPage", payload: value });
  };

  const setBotToolsPage = (value: number) => {
    dispatch({ type: "setBotToolsPage", payload: value });
  };

  const setAgentsPage = (value: number) => {
    dispatch({ type: "setAgentsPage", payload: value });
  };

  return (
    <AppContext.Provider
      value={{
        menu,
        layout,
        loaded,
        clientsList,
        auth,
        navElevation,
        appNavigation,
        clientPage,
        toolsPage,
        botToolsPage,
        agentsPage,
        setCustomersList,
        setLogin,
        setLoaded,
        setMenu,
        setAuthUser,
        setNavElevation,
        setAppNavigation,
        replacePath,
        cleanState,
        setClientPage,
        setToolsPage,
        setBotToolsPage,
        setAgentsPage,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextState => useContext(AppContext);

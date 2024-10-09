import React, { useContext, useReducer } from "react";
import { AppContext, AppContextState, INITIAL_STATE } from "./AppContext.ts";
import { AppReducer } from "./AppReducer.ts";
import { useWidth } from "@/hooks/useWidth.ts";
import { useMediaQuery } from '@mui/material';
import { AuthUser } from "@/types/Auth.ts";
import { AiTeamsDetails } from "@/types/AiTeams.ts";
import { PathData } from "@/types/Pathbar.ts";
import theme from "@/styles/theme";

interface AppProviderProps {
  children: React.ReactNode | Array<React.ReactNode>;
}

export const AppProvider = ({ children }: AppProviderProps) => {
  const [
    {
      menu,
      layout,
      loaded,
      aiTeams,
      auth,
      navElevation,
      appNavigation,
      clientPage,
      toolsPage,
      agentsPage,
    },
    dispatch,
  ] = useReducer(AppReducer, INITIAL_STATE);

  const width = useWidth();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  React.useEffect(() => {
    dispatch({ type: "setBreakPoint", payload: width });

    if (isMobile) {
      dispatch({ type: "setDevice", payload: "mobile" });
    } else if (isTablet) {
      dispatch({ type: "setDevice", payload: "tablet" });
    } else {
      dispatch({ type: "setDevice", payload: "pc" });
    }
  }, [width, isMobile, isTablet]);

  const setAuthUser = (value: AuthUser | null) => {
    dispatch({ type: "setAuthUser", payload: value });
  };
  const setLogin = (value: AuthUser) => {
    dispatch({ type: "setAuthUser", payload: value });
  };

  const setLoaded = (value: boolean) => {
    dispatch({ type: "setLoaded", payload: value });
  };

  const setCustomersList = (value: AiTeamsDetails[]) => {
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

  const setAgentsPage = (value: number) => {
    dispatch({ type: "setAgentsPage", payload: value });
  };

  return (
    <AppContext.Provider
      value={{
        menu,
        layout,
        loaded,
        aiTeams,
        auth,
        navElevation,
        appNavigation,
        clientPage,
        toolsPage,
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
        setAgentsPage,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextState => useContext(AppContext);

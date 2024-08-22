import React, { useContext, useReducer } from "react";
import { AppContext, AppContextState, INITIAL_STATE } from "./AppContext.ts";
import { AppReducer } from "./AppReducer.ts";
import { useWidth } from "@/hooks/useWidth.ts";
import { isWidthDown } from "@mui/material/Hidden/withWidth";
import { AuthUser } from "@/types/Auth.ts";
import { ClientDetails } from "@/types/Clients.ts";

interface AppProviderProps {
  children: React.ReactNode | Array<React.ReactNode>;
}

export const AppProvider = ({ children }: AppProviderProps) => {
  const [{ menu, layout, loaded, clientsList, auth, navElevation }, dispatch] =
    useReducer(AppReducer, INITIAL_STATE);

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

  const setAuthUser = (value: AuthUser) => {
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

  const setMenuOpen = (value: boolean) => {
    dispatch({ type: "setMenuOpen", payload: value });
  };

  const setNavElevation = (value: string) => {
    dispatch({ type: "setNavElevation", payload: value });
  };

  const cleanState = () => {
    dispatch({ type: "cleanState" });
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
        setCustomersList,
        setLogin,
        setLoaded,
        setMenuOpen,
        setAuthUser,
        setNavElevation,
        cleanState,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextState => useContext(AppContext);

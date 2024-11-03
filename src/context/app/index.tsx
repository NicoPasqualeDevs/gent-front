import React, { useContext, useReducer, Dispatch, SetStateAction } from "react";
import { AppContext, AppContextState, INITIAL_STATE } from "./AppContext";
import { AppReducer, AppContextActions } from "./AppReducer";
import { useWidth } from "@/hooks/useWidth";
import { useMediaQuery } from '@mui/material';
import theme from "@/styles/theme";
import { AiTeamsDetails } from "@/types/AiTeams";
import { PathData } from "@/types/Pathbar";
import { authStorage } from "@/services/auth";
import { AuthUser } from "@/types/Auth";
import { menuStorage } from "@/services/menu";
import { languageStorage } from "@/services/language";

interface AppProviderProps {
  children: React.ReactNode | Array<React.ReactNode>;
}

export const AppProvider = ({ children }: AppProviderProps) => {
  const [state, dispatch] = useReducer<
    React.Reducer<AppContextState, AppContextActions>
  >(AppReducer, INITIAL_STATE);

  const [isInitialized, setIsInitialized] = React.useState(false);
  const { getAuth } = authStorage();

  const {
    menu,
    layout,
    loaded,
    aiTeams,
    auth,
    navElevation,
    appNavigation,
    language,
    clientPage,
  } = state;

  const width = useWidth();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  React.useEffect(() => {
    const initializeAuth = async () => {
      const savedAuth = getAuth();
      const { getLanguage } = languageStorage();
      const savedLanguage = getLanguage();
      
      if (savedAuth?.token) {
        dispatch({ type: "setAuth", payload: savedAuth });
        dispatch({ type: "setAppNavigation", payload: [] });
      }
      if (savedLanguage) {
        dispatch({ type: "setLanguage", payload: savedLanguage });
      }
      setIsInitialized(true);
    };
    initializeAuth();
  }, []);

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

  const setAuth = React.useCallback((value: AuthUser | null) => {
    const { saveAuth, removeAuth } = authStorage();
    
    if (value) {
      const authToStore: AuthUser = {
        token: value.token,
        uuid: value.uuid,
        email: value.email,
        first_name: value.first_name,
        last_name: value.last_name,
        is_superuser: value.is_superuser
      };
      
      saveAuth(authToStore);
      dispatch({ type: "setAuth", payload: authToStore });
      dispatch({ type: "setAppNavigation", payload: [] });
    } else {
      removeAuth();
      dispatch({ type: "setAuth", payload: null });
      dispatch({ type: "setAppNavigation", payload: [] });
    }
  }, []);

  const setLoaded: Dispatch<SetStateAction<boolean>> = React.useCallback((value) => {
    if (typeof value === 'function') {
      dispatch({ type: "setLoaded", payload: value(loaded) });
    } else {
      dispatch({ type: "setLoaded", payload: value });
    }
  }, [loaded]);

  const setAiTeams: Dispatch<SetStateAction<AiTeamsDetails[]>> = React.useCallback((value) => {
    if (typeof value === 'function') {
      dispatch({ type: "setAiTeams", payload: value(aiTeams) });
    } else {
      dispatch({ type: "setAiTeams", payload: value });
    }
  }, [aiTeams]);

  const setMenu: Dispatch<SetStateAction<boolean>> = React.useCallback((value) => {
    const { saveMenuState } = menuStorage();
    
    if (typeof value === 'function') {
      const newValue = value(menu);
      saveMenuState(newValue);
      dispatch({ type: "setMenu", payload: newValue });
    } else {
      saveMenuState(value);
      dispatch({ type: "setMenu", payload: value });
    }
  }, [menu]);

  React.useEffect(() => {
    const { getMenuState } = menuStorage();
    const savedMenuState = getMenuState();
    if (savedMenuState !== menu) {
      dispatch({ type: "setMenu", payload: savedMenuState });
    }
  }, []);

  const setNavElevation: Dispatch<SetStateAction<string>> = React.useCallback((value) => {
    if (typeof value === 'function') {
      dispatch({ type: "setNavElevation", payload: value(navElevation) });
    } else {
      dispatch({ type: "setNavElevation", payload: value });
    }
  }, [navElevation]);

  const setAppNavigation: Dispatch<SetStateAction<PathData[]>> = React.useCallback((value) => {
    if (typeof value === 'function') {
      dispatch({ type: "setAppNavigation", payload: value(appNavigation) });
    } else {
      dispatch({ type: "setAppNavigation", payload: value });
    }
  }, [appNavigation]);

  const setLanguage: Dispatch<SetStateAction<string>> = React.useCallback((value) => {
    const { saveLanguage } = languageStorage();
    
    if (typeof value === 'function') {
      const newValue = value(language);
      saveLanguage(newValue);
      dispatch({ type: "setLanguage", payload: newValue });
    } else {
      saveLanguage(value);
      dispatch({ type: "setLanguage", payload: value });
    }
  }, [language]);

  const setClientPage = React.useCallback((page: number) => {
    dispatch({ type: "setClientPage", payload: page });
  }, []);

  const replacePath = (value: PathData[]) => {
    dispatch({ type: "replacePath", payload: value });
  };

  const cleanState = () => {
    dispatch({ type: "cleanState" });
  };

  if (!isInitialized) {
    return null;
  }

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
        language,
        clientPage,
        setAiTeams,
        setLoaded,
        setMenu,
        setAuth,
        setNavElevation,
        setAppNavigation,
        replacePath,
        cleanState,
        setLanguage,
        setClientPage,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextState => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

import { createContext } from "react";
import { AuthUser } from "@/types/Auth";
import { AiTeamsDetails } from "@/types/AiTeams";
import { PathData } from "@/types/Pathbar";
import { Breakpoint } from "@mui/material";
import { menuStorage } from "@/services/menu";
import { languageStorage } from "@/services/language";
import { fontStorage } from '@/services/font';

export interface AppContextState {
  menu: boolean;
  layout: {
    breakpoint: Breakpoint | undefined;
    device: string | undefined;
  };
  loaded: boolean;
  aiTeams: AiTeamsDetails[];
  auth: AuthUser | null;
  navElevation: string;
  appNavigation: PathData[];
  language: string;
  clientPage: number;
  showRobotCardHelp: boolean;
  fontLoaded: boolean;
  setAiTeams: React.Dispatch<React.SetStateAction<AiTeamsDetails[]>>;
  setLoaded: React.Dispatch<React.SetStateAction<boolean>>;
  setMenu: React.Dispatch<React.SetStateAction<boolean>>;
  setAuth: (value: AuthUser | null) => void;
  setNavElevation: React.Dispatch<React.SetStateAction<string>>;
  setAppNavigation: React.Dispatch<React.SetStateAction<PathData[]>>;
  replacePath: (value: PathData[]) => void;
  cleanState: () => void;
  setLanguage: React.Dispatch<React.SetStateAction<string>>;
  setClientPage: (page: number) => void;
  setShowRobotCardHelp: React.Dispatch<React.SetStateAction<boolean>>;
  setFontLoaded: React.Dispatch<React.SetStateAction<boolean>>;
}

export const INITIAL_STATE: AppContextState = {
  menu: menuStorage().getMenuState(),
  layout: {
    breakpoint: undefined,
    device: undefined
  },
  loaded: false,
  aiTeams: [],
  auth: null,
  navElevation: "0",
  appNavigation: [],
  language: languageStorage().getLanguage(),
  clientPage: 1,
  showRobotCardHelp: true,
  fontLoaded: fontStorage().getFontLoaded(),
  setAiTeams: () => { /* noop */ },
  setLoaded: () => { /* noop */ },
  setMenu: () => { /* noop */ },
  setAuth: () => { /* noop */ },
  setNavElevation: () => { /* noop */ },
  setAppNavigation: () => { /* noop */ },
  replacePath: () => { /* noop */ },
  cleanState: () => { /* noop */ },
  setLanguage: () => { /* noop */ },
  setClientPage: () => { /* noop */ },
  setShowRobotCardHelp: () => { /* noop */ },
  setFontLoaded: () => { /* noop */ },
};

export const AppContext = createContext<AppContextState | undefined>(undefined);

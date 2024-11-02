import { createContext } from "react";
import { AuthUser } from "@/types/Auth";
import { AiTeamsDetails } from "@/types/AiTeams";
import { PathData } from "@/types/Pathbar";
import { Breakpoint } from "@mui/material";

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
}

export const INITIAL_STATE: AppContextState = {
  menu: false,
  layout: {
    breakpoint: undefined,
    device: undefined
  },
  loaded: false,
  aiTeams: [],
  auth: null,
  navElevation: "0",
  appNavigation: [],
  language: "es",
  clientPage: 1,
  setAiTeams: () => {},
  setLoaded: () => {},
  setMenu: () => {},
  setAuth: () => {},
  setNavElevation: () => {},
  setAppNavigation: () => {},
  replacePath: () => {},
  cleanState: () => {},
  setLanguage: () => {},
  setClientPage: () => {},
};

export const AppContext = createContext<AppContextState | undefined>(undefined);

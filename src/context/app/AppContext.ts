import { createContext } from "react";
import { Breakpoint } from "@mui/material";
import { AuthTempInfo, AuthUser } from "@/types/Auth.ts";
import { AiTeamsDetails } from "@/types/AiTeams";
import { PathData } from "@/types/Pathbar";

export type AppDevice = "mobile" | "tablet" | "pc";

export interface AppContextState {
  auth: { user: AuthUser | null; tempInfo?: AuthTempInfo };
  layout: {
    breakpoint: Breakpoint;
    device: "mobile" | "tablet" | "pc";
  };
  menu: boolean;
  loaded: boolean;
  aiTeams: AiTeamsDetails[] | undefined;
  navElevation: string;
  appNavigation: PathData[];
  clientPage: number;
  toolsPage: number;
  agentsPage: number;

  setCustomersList: (value: AiTeamsDetails[]) => void;
  setLogin: (value: AuthUser) => void;
  setAuthUser: (value: AuthUser | null) => void;
  setMenu: (value: boolean) => void;
  setLoaded: (value: boolean) => void;
  setNavElevation: (value: string) => void;
  cleanState: () => void;
  setAppNavigation: (value: PathData) => void;
  replacePath: (value: PathData[]) => void;
  setClientPage: (value: number) => void;
  setToolsPage: (value: number) => void;
  setAgentsPage: (value: number) => void;
}

export const INITIAL_STATE: AppContextState = {
  auth: { user: null },
  layout: {
    breakpoint: "lg",
    device: "pc",
  },
  menu: true,
  navElevation: "",
  loaded: false,
  aiTeams: undefined,
  appNavigation: [] as PathData[],
  clientPage: 1,
  toolsPage: 1,
  agentsPage: 1,
} as AppContextState;

export const AppContext = createContext(INITIAL_STATE);

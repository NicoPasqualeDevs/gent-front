import { createContext } from "react";
import { Breakpoint } from "@mui/material";
import { AuthTempInfo, AuthUser } from "@/types/Auth.ts";
import { ClientDetails } from "@/types/Clients";
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
  clientsList: ClientDetails[] | undefined;
  navElevation: string;
  appNavigation: PathData[];

  setCustomersList: (value: ClientDetails[]) => void;
  setLogin: (value: AuthUser) => void;
  setAuthUser: (value: AuthUser | null) => void;
  setMenu: (value: boolean) => void;
  setLoaded: (value: boolean) => void;
  setNavElevation: (value: string) => void;
  cleanState: () => void;
  setAppNavigation: (value: PathData) => void;
  replacePath: (value: PathData[]) => void;
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
  clientsList: undefined,
  appNavigation: [] as PathData[],
} as AppContextState;

export const AppContext = createContext(INITIAL_STATE);

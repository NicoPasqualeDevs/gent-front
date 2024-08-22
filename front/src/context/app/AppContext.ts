import { createContext } from "react";
import { Breakpoint } from "@mui/material";
import { AuthTempInfo, AuthUser } from "@/types/Auth.ts";
import { ClientDetails } from "@/types/Clients";

export type AppDevice = "mobile" | "tablet" | "pc";

export interface AppContextState {
  auth: { user: AuthUser | null; tempInfo?: AuthTempInfo };
  layout: {
    breakpoint: Breakpoint;
    device: "mobile" | "tablet" | "pc";
  };
  menu: {
    open: boolean;
  };
  loaded: boolean;
  clientsList: ClientDetails[] | undefined;
  navElevation: string;

  setCustomersList: (value: ClientDetails[]) => void;
  setLogin: (value: AuthUser) => void;
  setAuthUser: (value: AuthUser) => void;
  setMenuOpen: (value: boolean) => void;
  setLoaded: (value: boolean) => void;
  setNavElevation: (value: string) => void;
  cleanState: () => void;
}

export const INITIAL_STATE: AppContextState = {
  auth: { user: null },
  layout: {
    breakpoint: "lg",
    device: "pc",
  },
  menu: {
    open: true,
  },
  navElevation: "",
  loaded: false,
  clientsList: undefined,
} as AppContextState;

export const AppContext = createContext(INITIAL_STATE);

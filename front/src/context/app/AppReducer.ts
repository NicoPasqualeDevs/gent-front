import { AppContextState, INITIAL_STATE, AppDevice } from "./AppContext.ts";
import { Breakpoint } from "@mui/material";
import { AuthUser } from "@/types/Auth.ts";
import { ClientDetails } from "@/types/Clients.ts";

type AppContextActions =
  | { type: "setAuthUser"; payload: AuthUser | null }
  | { type: "setLoaded"; payload: boolean }
  | { type: "setCustomersList"; payload: ClientDetails[] }
  | { type: "setMenu"; payload: boolean }
  | { type: "setBreakPoint"; payload: Breakpoint }
  | { type: "setDevice"; payload: AppDevice }
  | { type: "setNavElevation"; payload: string }
  | { type: "cleanState" };

export const AppReducer = (
  state: AppContextState,
  action: AppContextActions
): AppContextState => {
  switch (action.type) {
    case "setAuthUser":
      return {
        ...state,
        auth: { ...state.auth, user: action.payload },
      };

    case "cleanState": {
      return {
        ...INITIAL_STATE,
      };
    }

    case "setLoaded": {
      return {
        ...state,
        loaded: action.payload,
      };
    }

    case "setCustomersList": {
      return {
        ...state,
        clientsList: action.payload,
      };
    }

    case "setMenu":
      return {
        ...state,
        menu: action.payload,
      };

    case "setBreakPoint":
      return {
        ...state,
        layout: { ...state.layout, breakpoint: action.payload },
      };

    case "setNavElevation":
      return {
        ...state,
        navElevation: action.payload,
      };

    case "setDevice":
      return {
        ...state,
        layout: { ...state.layout, device: action.payload },
      };

    default:
      return state;
  }
};

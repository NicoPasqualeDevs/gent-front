import { AppContextState, INITIAL_STATE, AppDevice } from "./AppContext.ts";
import { Breakpoint } from "@mui/material";
import { AuthUser } from "@/types/Auth.ts";
import { AiTeamsDetails } from "@/types/AiTeams.ts";
import { PathData } from "@/types/Pathbar.ts";

type AppContextActions =
  | { type: "setAuth"; payload: AuthUser | null }
  | { type: "setLoaded"; payload: boolean }
  | { type: "setCustomersList"; payload: AiTeamsDetails[] }
  | { type: "setMenu"; payload: boolean }
  | { type: "setBreakPoint"; payload: Breakpoint }
  | { type: "setDevice"; payload: AppDevice }
  | { type: "setNavElevation"; payload: string }
  | { type: "setAppNavigation"; payload: PathData }
  | { type: "replacePath"; payload: PathData[] }
  | { type: "setClientPage"; payload: number }
  | { type: "setToolsPage"; payload: number }
  | { type: "setAgentsPage"; payload: number }
  | { type: "cleanState" }
  | { type: "setLanguage"; payload: string };

export const AppReducer = (
  state: AppContextState,
  action: AppContextActions
): AppContextState => {
  switch (action.type) {
    case "setAuth":
      return {
        ...state,
        auth: { user: action.payload },
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
        aiTeams: action.payload,
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
    case "setAppNavigation": {
      let exist_element = false;
      state.appNavigation.forEach((item) => {
        if (item.label === action.payload.label) {
          exist_element = true;
        }
      });
      if (!exist_element) {
        return {
          ...state,
          appNavigation: [...state.appNavigation, action.payload],
        };
      } else {
        return state;
      }
    }
    case "replacePath": {
      return {
        ...state,
        appNavigation: action.payload,
      };
    }
    case "setClientPage": {
      return {
        ...state,
        clientPage: action.payload,
      };
    }
    case "setToolsPage": {
      return {
        ...state,
        toolsPage: action.payload,
      };
    }
    case "setAgentsPage": {
      return {
        ...state,
        agentsPage: action.payload,
      };
    }
    case "setLanguage":
      return {
        ...state,
        language: action.payload,
      };
    default:
      return state;
  }
};

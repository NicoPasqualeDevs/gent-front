import { AppContextState, INITIAL_STATE } from "./AppContext";
import { Breakpoint } from "@mui/material";
import { AuthUser } from "@/types/Auth";
import { AiTeamsDetails } from "@/types/AiTeams";
import { PathData } from "@/types/Pathbar";

export type AppContextActions =
  | { type: "setAuth"; payload: AuthUser | null }
  | { type: "setLoaded"; payload: boolean }
  | { type: "setAiTeams"; payload: AiTeamsDetails[] }
  | { type: "setMenu"; payload: boolean }
  | { type: "setBreakPoint"; payload: Breakpoint }
  | { type: "setDevice"; payload: string }
  | { type: "setNavElevation"; payload: string }
  | { type: "setAppNavigation"; payload: PathData[] }
  | { type: "replacePath"; payload: PathData[] }
  | { type: "setLanguage"; payload: string }
  | { type: "setClientPage"; payload: number }
  | { type: "cleanState" }
  | { type: "setShowRobotCardHelp"; payload: boolean }
  | { type: "setFontLoaded"; payload: boolean };

type Layout = {
  breakpoint: Breakpoint | undefined;
  device: string | undefined;
};

export const AppReducer = (
  state: AppContextState,
  action: AppContextActions
): AppContextState => {
  switch (action.type) {
    case "setAuth":
      return {
        ...state,
        auth: action.payload,
      };
    case "setLoaded":
      return {
        ...state,
        loaded: action.payload,
      };
    case "setAiTeams":
      return {
        ...state,
        aiTeams: action.payload,
      };
    case "setMenu":
      return {
        ...state,
        menu: action.payload,
      };
    case "setBreakPoint":
      return {
        ...state,
        layout: {
          ...state.layout as Layout,
          breakpoint: action.payload
        },
      };
    case "setDevice":
      return {
        ...state,
        layout: {
          ...state.layout as Layout,
          device: action.payload
        },
      };
    case "setNavElevation":
      return {
        ...state,
        navElevation: action.payload,
      };
    case "setAppNavigation":
      return {
        ...state,
        appNavigation: action.payload,
      };
    case "replacePath":
      return {
        ...state,
        appNavigation: action.payload,
      };
    case "setLanguage":
      return {
        ...state,
        language: action.payload,
      };
    case "setClientPage":
      return {
        ...state,
        clientPage: action.payload,
      };
    case "cleanState":
      return {
        ...INITIAL_STATE,
        ...state,
        menu: INITIAL_STATE.menu,
        layout: INITIAL_STATE.layout,
        loaded: INITIAL_STATE.loaded,
        aiTeams: INITIAL_STATE.aiTeams,
        auth: INITIAL_STATE.auth,
        navElevation: INITIAL_STATE.navElevation,
        appNavigation: INITIAL_STATE.appNavigation,
        language: INITIAL_STATE.language,
        fontLoaded: state.fontLoaded,
      };
    case "setShowRobotCardHelp":
      return {
        ...state,
        showRobotCardHelp: action.payload,
      };
    case "setFontLoaded":
      return {
        ...state,
        fontLoaded: action.payload,
      };
    default:
      return state;
  }
};

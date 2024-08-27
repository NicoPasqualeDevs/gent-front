import { WidgetData } from "@/types/Bots";
import { Widget_Initial_State, WidgetContextState } from "./WidgetContext";

type WidgetContextActions =
  | { type: "setPopUpState"; payload: boolean }
  | { type: "setChatState"; payload: boolean }
  | { type: "setWidgetData"; payload: WidgetData }
  | { type: "setConversationID"; payload: string }
  | { type: "setHistoryLoaded"; payload: boolean }
  | { type: "setHistoryError"; payload: boolean }
  | { type: "setStartQuestion"; payload: string }
  | { type: "cleanState" };

export const WidgetReducer = (
  state: WidgetContextState,
  action: WidgetContextActions
): WidgetContextState => {
  switch (action.type) {
    case "setPopUpState": {
      return {
        ...state,
        popUpState: action.payload,
      };
    }
    case "setChatState": {
      return {
        ...state,
        chatState: action.payload,
      };
    }
    case "setWidgetData": {
      return {
        ...state,
        widgetData: action.payload,
      };
    }
    case "setConversationID": {
      return {
        ...state,
        conversation_id: action.payload,
      };
    }
    case "setHistoryLoaded": {
      return {
        ...state,
        historyLoaded: action.payload,
      };
    }
    case "setHistoryError": {
      return {
        ...state,
        historyError: action.payload,
      };
    }
    case "setStartQuestion": {
      return {
        ...state,
        startQuestion: action.payload,
      };
    }
    case "cleanState": {
      return {
        ...Widget_Initial_State,
      };
    }
    default:
      return state;
  }
};

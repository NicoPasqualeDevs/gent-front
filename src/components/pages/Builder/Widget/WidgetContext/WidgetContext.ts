import { WidgetData } from "@/types/Bots";
import { createContext } from "react";

export interface WidgetContextState {
  popUpState: boolean;
  chatState: boolean;
  widgetData: WidgetData;
  conversation_id: string;
  historyLoaded: boolean;
  historyError: boolean;
  startQuestion: string;
  setPopUpState: (value: boolean) => void;
  setChatState: (value: boolean) => void;
  setWidgetData: (value: WidgetData) => void;
  setConversationID: (value: string) => void;
  setHistoryLoaded: (value: boolean) => void;
  setHistoryError: (value: boolean) => void;
  setStartQuestion: (value: string) => void;
}

export const Widget_Initial_State: WidgetContextState = {
  popUpState: false,
  chatState: false,
  widgetData: { id: "" },
  conversation_id: "",
  historyLoaded: false,
  historyError: false,
  startQuestion: "",
} as WidgetContextState;

export const WidgetContext = createContext(Widget_Initial_State);

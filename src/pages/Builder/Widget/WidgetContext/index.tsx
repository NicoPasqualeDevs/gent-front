import { useContext, useReducer } from "react";
import {
  WidgetContext,
  WidgetContextState,
  Widget_Initial_State,
} from "./WidgetContext";
import { WidgetReducer } from "./WidgetReducer";
import { WidgetData } from "@/types/Bots";

interface WidgetProviderProps {
  children: React.ReactNode | Array<React.ReactNode>;
}

export const WidgetProvider = ({ children }: WidgetProviderProps) => {
  const [
    {
      popUpState,
      chatState,
      widgetData,
      conversation_id,
      historyLoaded,
      historyError,
      startQuestion,
    },
    dispatch,
  ] = useReducer(WidgetReducer, Widget_Initial_State);

  const setPopUpState = (value: boolean) => {
    dispatch({ type: "setPopUpState", payload: value });
  };

  const setChatState = (value: boolean) => {
    dispatch({ type: "setChatState", payload: value });
  };

  const setWidgetData = (value: WidgetData) => {
    dispatch({ type: "setWidgetData", payload: value });
  };

  const setConversationID = (value: string) => {
    dispatch({ type: "setConversationID", payload: value });
  };

  const setHistoryLoaded = (value: boolean) => {
    dispatch({ type: "setHistoryLoaded", payload: value });
  };

  const setHistoryError = (value: boolean) => {
    dispatch({ type: "setHistoryError", payload: value });
  };

  const setStartQuestion = (value: string) => {
    dispatch({ type: "setStartQuestion", payload: value });
  };

  return (
    <WidgetContext.Provider
      value={{
        popUpState,
        chatState,
        widgetData,
        conversation_id,
        historyLoaded,
        historyError,
        startQuestion,
        setPopUpState,
        setChatState,
        setWidgetData,
        setConversationID,
        setHistoryLoaded,
        setHistoryError,
        setStartQuestion,
      }}
    >
      {children}
    </WidgetContext.Provider>
  );
};

export const useWidgetContext = (): WidgetContextState =>
  useContext(WidgetContext);

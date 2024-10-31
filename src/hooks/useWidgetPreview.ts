import { useState } from 'react';

export const useWidgetPreview = () => {
  const [chatState, setChatState] = useState(false);
  const [popUpState, setPopUpState] = useState(false);

  const toggleChat = () => setChatState(prev => !prev);
  const togglePopUp = () => setPopUpState(prev => !prev);

  return {
    chatState,
    popUpState,
    toggleChat,
    togglePopUp
  };
}; 
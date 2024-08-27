import React from "react";

const autoScroll = (element: React.RefObject<HTMLDivElement>) => {
  if (element.current) {
    element.current.scrollTop = element.current.scrollHeight;
  }
};

export default autoScroll;

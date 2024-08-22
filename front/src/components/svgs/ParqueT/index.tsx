import React from "react";

type ImgProps = Omit<React.ImgHTMLAttributes<HTMLImageElement>, "src">;

const ParqueT = React.forwardRef<HTMLImageElement, ImgProps>(({ ...props }, ref) => {
  //return <img alt="parque-logo" ref={ref} src={"/src/assets/svg/logo_parque_t.svg"} {...props} />
  return <img alt="parque-logo" ref={ref} src={"https://cdn.discordapp.com/attachments/404998818107752459/1228719194489622579/CHATBOT_SVG-03.png?ex=662d10ec&is=661a9bec&hm=7fd8b69f87b0d2ed06fe7ab8f67bc2cfe57def22a86ca9c8cae5a363ea02c9c7&"} {...props} />
});

export default ParqueT;

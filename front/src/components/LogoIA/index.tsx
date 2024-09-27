import React from "react";

type LogoProps = Omit<React.ImgHTMLAttributes<HTMLImageElement>, "src">;

const LogoIA = React.forwardRef<HTMLImageElement, LogoProps>(
  ({ ...props }, ref) => {
    return (
      <img
        alt="Agents-Index"
        ref={ref}
        src={
          "https://cdn.discordapp.com/attachments/404998818107752459/1225022335032234066/asg.jpg?ex=661f9df4&is=660d28f4&hm=e37ae880f99ecf9714335779a4f417de074bab15f5244ffe92fec5381c6aa1bc&"
        }
        {...props}
      />
    );
  }
);

export default LogoIA;

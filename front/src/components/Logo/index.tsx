import React from "react";

type LogoProps = Omit<React.ImgHTMLAttributes<HTMLImageElement>, "src">;

const Logo = React.forwardRef<HTMLImageElement, LogoProps>(
  ({ ...props }, ref) => {
    return (
      <img
        alt="Agents-Index"
        ref={ref}
        src={
          "https://w7.pngwing.com/pngs/328/599/png-transparent-male-avatar-user-profile-profile-heroes-necktie-recruiter.png"
        }
        {...props}
      />
    );
  }
);

export default Logo;

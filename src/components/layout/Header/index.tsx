import React from "react";
import { Typography, Avatar, Tooltip } from "@mui/material";
import { useAppContext } from "@/context/app";
import theme from "@/styles/theme";
import {
  BrandContainer,
  BrandMenuBtn,
  HeaderContainer,
  UserBubble,
  UserBubbleContainer,
} from "@/components/styledComponents/Layout";

const Header: React.FC = () => {
  const {
    auth,
    layout: { breakpoint },
    menu,
    setMenu,
  } = useAppContext();

  return (
    <HeaderContainer container>
      <BrandContainer item xs={8} md={3}>
        <Tooltip title={menu ? "Contraer menú" : " Expandir menú"} arrow>
          <BrandMenuBtn
            onClick={() => {
              setMenu(!menu);
            }}
          />
        </Tooltip>
        <Typography variant="h4" marginLeft={"10px"}>
          IA-Maker
        </Typography>
      </BrandContainer>
      <UserBubbleContainer item xs={4} md={9}>
        {auth.user && (breakpoint === "lg" || breakpoint === "xl") ? (
          <UserBubble>
            <Typography
              variant="body1"
              color={theme.palette.primary.contrastText}
            >
              {auth.user.email ? auth.user.email : ""}
            </Typography>
          </UserBubble>
        ) : (
          <Avatar sx={{ marginRight: "20px" }}>
            {auth.user && auth.user.email.trim() !== ""
              ? auth.user.email[0].toUpperCase()
              : null}
          </Avatar>
        )}
      </UserBubbleContainer>
    </HeaderContainer>
  );
};

export default Header;

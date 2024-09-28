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
import { useNavigate } from "react-router-dom";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const {
    auth,
    layout: { breakpoint },
    menu,
    replacePath,
    setMenu,
  } = useAppContext();

  const handleProfileClick = () => {
    replacePath([
      {
        label: "Perfil",
        current_path: "/profile",
        preview_path: "/",
      },
    ]);
    navigate('/profile');
  };

  return (
    <HeaderContainer container>
      <BrandContainer item xs={8} md={3} sx={{paddingLeft: "5px"}}>
        <Tooltip title={menu ? "Contraer menú" : " Expandir menú"} arrow>
          <BrandMenuBtn
            onClick={() => {
              setMenu(!menu);
            }}
          />
        </Tooltip>
        <Typography variant="h4" marginLeft={"10px"}>
          Gents
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
          <Avatar 
            sx={{ marginRight: "5px", cursor:"pointer" }}
            onClick={handleProfileClick}
          >
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

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
import Pathbar from "../Pathbar";

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

  const isLargeScreen = breakpoint === "lg" || breakpoint === "xl";

  return (
    <HeaderContainer container>
      <BrandContainer item xs={8} md={3} sx={{paddingLeft: "5px", display: "flex", alignItems: "center"}}>
        <Tooltip title={menu ? "Contraer menú" : " Expandir menú"} arrow>
          <BrandMenuBtn
            onClick={() => {
              setMenu(!menu);
            }}
          />
        </Tooltip>
        <Typography variant="h4" marginLeft={"10px"} marginRight={"20px"}>
          Gents
        </Typography>
        {isLargeScreen && <Pathbar />}
      </BrandContainer>
      <UserBubbleContainer item xs={4} md={9} sx={{ display: "flex", justifyContent: "flex-end", paddingRight: "5px" }}>
        {auth.user && isLargeScreen ? (
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
            sx={{ cursor:"pointer" }}
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

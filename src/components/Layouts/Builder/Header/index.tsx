import React, { useState, useRef, useEffect } from "react";
import { Typography, Avatar, Tooltip, Box } from "@mui/material";
import { useAppContext } from "@/context";
import {
  BrandContainer,
  BrandMenuBtn,
  HeaderContainer,
  UserBubble,
  UserBubbleContainer,
} from "@/components/styledComponents/Layout";
import { useNavigate } from "react-router-dom";
import Pathbar from "../Pathbar";
import { useTheme } from "@mui/material/styles";
import LanguageSelector from "@/components/LanguageSelector"; // Importamos el LanguageSelector
import { languages } from "@/utils/Traslations";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const {
    auth,
    layout: { breakpoint },
    menu,
    replacePath,
    setMenu,
    language
  } = useAppContext();
  const t = languages[language as keyof typeof languages];

  const handleProfileClick = () => {
    replacePath([
      {
        label: t.header.profile,
        current_path: "/profile",
        preview_path: "/",
        translationKey: "profile"
      },
    ]);
    navigate('/profile');
  };

  const isLargeScreen = breakpoint === "lg" || breakpoint === "xl";
  const [showFullName, setShowFullName] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const theme = useTheme();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleMouseEnter = () => {
    setShowFullName(true);
    setIsTransitioning(true);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const handleMouseLeave = () => {
    setShowFullName(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setIsTransitioning(false);
    }, 500); // Ajusta este valor para que coincida con la duración de la transición
  };

  return (
    <HeaderContainer container>
      <BrandContainer item xs={8} md={3} sx={{ paddingLeft: "5px", display: "flex", alignItems: "center" }}>
        <Tooltip title={menu ? "Contraer menú" : " Expandir menú"} arrow>
          <BrandMenuBtn
            onClick={() => {
              setMenu(!menu);
            }}
          />
        </Tooltip>
        <Box
          width={showFullName ? "120px" : "38px"}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          sx={{
            transition: "0.5s",
            marginLeft: "10px",
            marginRight: "20px",
          }}
        >
          <Typography
            onClick={() => navigate("/builder")}
            color={"white"}
            sx={{
              fontSize: "30px",
              fontFamily: "ROBO",
              padding: "0px 5px",
              marginLeft: "10px",
              cursor: "pointer",
              overflow: "hidden",
              textShadow: showFullName ? "none" : `0 0 4.5px ${theme.palette.primary.light}`,
              transition: "all 0.25s ease-in-out",
            }}
          >
            {showFullName || isTransitioning ? "gENTS" : "g"}
          </Typography>
        </Box>
        {isLargeScreen && <Pathbar />}
      </BrandContainer>
      <UserBubbleContainer item xs={4} md={9} sx={{ display: "flex", justifyContent: "flex-end", paddingRight: "5px", alignItems: "center" }}>
        <Box sx={{ marginRight: 2 }}>
          <LanguageSelector />
        </Box>
        {auth && isLargeScreen ? (
          <UserBubble>
            <Typography
              variant="body1"
              color={theme.palette.secondary.contrastText}
              onClick={handleProfileClick}
              sx={{
                display: 'flex',
                fontWeight: '700',
                alignItems: 'center',
                padding: '0px 10px',
                height: '100%',
                cursor: 'pointer'
              }}
            >
              {auth?.email ? auth.email : ""}
            </Typography>
          </UserBubble>
        ) : (
          <Avatar
            sx={{ cursor: "pointer" ,
              backgroundColor: theme.palette.secondary.main,
              fontWeight: '700',
              color: theme.palette.secondary.contrastText
            }}
            onClick={handleProfileClick}
          >
            {auth && auth.email.trim() !== ""
              ? auth.email[0].toUpperCase()
              : null}
          </Avatar>
        )}
      </UserBubbleContainer>
    </HeaderContainer>
  );
};

export default Header;

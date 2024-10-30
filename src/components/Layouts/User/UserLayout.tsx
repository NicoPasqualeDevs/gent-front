import React, { useState } from "react";
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import LeftMenu from "./LeftMenu";
import RightMenu from "./RightMenu";
import { Box } from "@mui/material";

interface ComponentProps {
  children: React.ReactNode;
}

const UserLayout: React.FC<ComponentProps> = ({ children }) => {
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));
  const [isLeftMenuOpen, setIsLeftMenuOpen] = useState(false);

  const toggleLeftMenu = () => {
    setIsLeftMenuOpen(!isLeftMenuOpen);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
        {isLargeScreen && (
          <Box sx={{ width: '240px', flexShrink: 0 }}>
            <LeftMenu />
          </Box>
        )}
        <Box sx={{ 
          flexGrow: 1, 
          width: isLargeScreen ? 'calc(100% - 360px)' : '100%',
          overflowY: 'auto',
          overflowX: 'hidden',
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: 'rgba(0,0,0,0.1)',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: theme.palette.primary.main,
            borderRadius: '4px',
            '&:hover': {
              backgroundColor: theme.palette.primary.dark,
            },
          },
        }}>
          {children}
        </Box>
        {isLargeScreen && (
          <Box sx={{ width: '120px', flexShrink: 0 }}>
            <RightMenu />
          </Box>
        )}
        {!isLargeScreen && (
          <LeftMenu isMobile isOpen={isLeftMenuOpen} onToggle={toggleLeftMenu} />
        )}
      </Box>
    </Box>
  );
};

export default UserLayout;

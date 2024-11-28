import React from 'react';
import { Box } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

interface PopUpButtonProps {
  isOpen: boolean;
  onClick: () => void;
  iconChat: string;
  iconHidden: string;
  primaryColor: string;
  primaryTextContrast: string;
  secondaryColor: string;
  secondaryTextContrast: string;
  badgeColor: string;
  badgeContrast: string;
}

export const PopUpButton: React.FC<PopUpButtonProps> = ({
  isOpen,
  onClick,
  iconChat,
  iconHidden,
  primaryColor,
  primaryTextContrast,
  secondaryColor,
  secondaryTextContrast,
  badgeColor,
  badgeContrast
}) => {
  return (
    <Box
      onClick={onClick}
      sx={{
        position: 'absolute',
        bottom: '5px',
        right: '10px',
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        backgroundColor: primaryColor,
        color: primaryTextContrast,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        '&:hover': {
          backgroundColor: secondaryColor,
          color: secondaryTextContrast
        }
      }}
    >
      {!isOpen && (
        <Box
          sx={{
            position: 'absolute',
            top: -10,
            left: -10,
            width: '22px',
            height: '22px',
            borderRadius: '50%',
            backgroundColor: badgeColor,
            color: badgeContrast,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px'
          }}
        >
          1
        </Box>
      )}
      
      {isOpen ? (
        iconHidden ? (
          <img 
            src={iconHidden} 
            alt="Hide Chat" 
            style={{ 
              width: '50%',
              height: '50%'
            }} 
          />
        ) : (
          <KeyboardArrowDownIcon />
        )
      ) : (
        iconChat ? (
          <img 
            src={iconChat} 
            alt="Open Chat" 
            style={{ 
              width: '50%',
              height: '50%'
            }} 
          />
        ) : (
          <ChatIcon />
        )
      )}
    </Box>
  );
}; 
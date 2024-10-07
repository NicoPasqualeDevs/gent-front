import React from 'react';
import { Box } from '@mui/material';

const BackgroundLines: React.FC = () => {
  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden',
        zIndex: -1,
        opacity: 0.1,
        '&::before, &::after': {
          content: '""',
          position: 'absolute',
          width: '200vw',
          height: '200vh',
          top: '-50%',
          left: '-50%',
          zIndex: -1,
          backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(255, 255, 255, .05) 25%, rgba(255, 255, 255, .05) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, .05) 75%, rgba(255, 255, 255, .05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(255, 255, 255, .05) 25%, rgba(255, 255, 255, .05) 26%, transparent 27%, transparent 74%, rgba(255, 255, 255, .05) 75%, rgba(255, 255, 255, .05) 76%, transparent 77%, transparent)',
          backgroundSize: '50px 50px',
        },
        '&::after': {
          transform: 'rotate(30deg)',
        },
      }}
    />
  );
};

export default BackgroundLines;
import React, { Suspense } from 'react';
import LoadingFallback from '../LoadingFallback';
import { Box } from '@mui/material';
import GlowingText from '../GlowingText';
import { useAppContext } from '@/context';

interface DelayedSuspenseProps {
  children: React.ReactNode;
}

const DelayedSuspense: React.FC<DelayedSuspenseProps> = ({ children }) => {
  const { fontLoaded } = useAppContext();

  if (!fontLoaded) {
    return (
      <Box 
        sx={{
          height: "100vh",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: 'relative'
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '90%', sm: '75%', md: '50%', lg: '33%' },
          }}
        >
          <GlowingText>gENTS</GlowingText>
        </Box>
      </Box>
    );
  }

  return (
    <Suspense fallback={<LoadingFallback />}>
      {children}
    </Suspense>
  );
};

export default DelayedSuspense; 
import React from 'react';
import { useParams } from 'react-router-dom';
import { Box } from '@mui/material';

const TestAgent: React.FC = () => {
  const { agentId } = useParams<{ agentId: string }>();

  return (
    <Box 
      sx={{ 
        width: '100vw',
        height: '100vh',
        overflow: 'hidden'
      }}
    >
      <Box 
        component="iframe"
        src={`/widget/${agentId}`}
        sx={{
          width: '100%',
          height: '100%',
          border: 'none'
        }}
        title="Agent Test Chat"
      />
    </Box>
  );
};

export default TestAgent;

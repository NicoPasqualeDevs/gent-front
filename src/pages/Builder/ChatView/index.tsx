import React from 'react';
import { useParams } from 'react-router-dom';
import { Box } from '@mui/material';
import { useAppContext } from '@/context/app';
import LoadingFallback from '@/components/LoadingFallback';
import useLoadingState from '@/hooks/useLoadingState';

const ChatView: React.FC = () => {
  const { botId } = useParams();
  const { auth } = useAppContext();
  const { state } = useLoadingState();

  if (state.isLoading) {
    return <LoadingFallback />;
  }

  return (
    <Box>
      {/* Aquí va el contenido del chat */}
      <div>Chat View for bot: {botId}</div>
    </Box>
  );
};

export default ChatView;

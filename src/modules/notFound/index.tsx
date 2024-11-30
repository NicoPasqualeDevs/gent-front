import React, { useEffect } from 'react';
import { Grid, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from "@/context";
import { languages } from "@/utils/Traslations";
import useLoadingState from '@/hooks/useLoadingState';

interface CountdownState {
  countdown: number;
}

const NotFoundModule: React.FC = () => {
  const navigate = useNavigate();
  const { language } = useAppContext();
  const { state, setData } = useLoadingState<CountdownState>();
  const t = languages[language as keyof typeof languages].notFound;

  useEffect(() => {
    let countdown = 5;
    setData({ countdown });
    
    const timer = setInterval(() => {
      countdown -= 1;
      setData({ countdown });
      
      if (countdown <= 0) {
        clearInterval(timer);
        navigate(-1);
      }
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [navigate, setData]);

  return (
    <Grid container direction="column" alignItems="center" justifyContent="center" style={{ minHeight: '100vh' }}>
      <Typography variant="h2" gutterBottom>
        {t.title}
      </Typography>
      <Typography variant="body1" gutterBottom>
        {t.message}
      </Typography>
      <Typography variant="body2">
        {t.redirectMessage.replace("{countdown}", (state.data?.countdown || 0).toString())}
      </Typography>
    </Grid>
  );
};

export default NotFoundModule;

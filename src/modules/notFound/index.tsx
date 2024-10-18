import React, { useEffect, useState } from 'react';
import { Grid, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from "@/context/app";
import { languages } from "@/utils/traslations";

const NotFoundModule: React.FC = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);
  const { language } = useAppContext();
  const t = languages[language as keyof typeof languages].notFound;

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prevCount) => prevCount - 1);
    }, 1000);

    const redirectTimer = setTimeout(() => {
      navigate(-1);
    }, 5000);

    return () => {
      clearInterval(timer);
      clearTimeout(redirectTimer);
    };
  }, [navigate]);

  return (
    <Grid container direction="column" alignItems="center" justifyContent="center" style={{ minHeight: '100vh' }}>
      <Typography variant="h2" gutterBottom>
        {t.title}
      </Typography>
      <Typography variant="body1" gutterBottom>
        {t.message}
      </Typography>
      <Typography variant="body2">
        {t.redirectMessage.replace("{countdown}", countdown.toString())}
      </Typography>
    </Grid>
  );
};

export default NotFoundModule;

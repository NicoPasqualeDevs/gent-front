import React, { useEffect, useState } from "react";
import { Button, Grid, Typography, Box } from "@mui/material";
import * as Yup from "yup";
import { useFormik } from "formik";
import { AuthLoginData, AuthUser } from "@/types/Auth";
import useAuth from "@/hooks/useAuth";
import { ErrorToast } from "@/components/Toast";
import { useAppContext } from "@/context/app";
import { useNavigate } from "react-router-dom";
import { PasswordInput, TextInput } from "@/components/Inputs";
import { motion } from "framer-motion";
import { useTheme } from '@mui/material/styles';
import Snowfall from 'react-snowfall';
import LanguageSelector from '@/components/LanguageSelector';
import { languages } from "@/utils/Traslations";
import GlowingText from '@/components/GlowingText';

interface LoginInputError {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { setAuth, setNavElevation, language } = useAppContext();
  const { loginUser } = useAuth();
  const [inputError, setInputError] = useState<LoginInputError>({
    email: " ",
    password: " ",
  });
  const [showLoginForm, setShowLoginForm] = useState(false);
  const theme = useTheme();
  const [rotatingText, setRotatingText] = useState(0);
  const t = languages[language as keyof typeof languages].login;

  useEffect(() => {
    const interval = setInterval(() => {
      setRotatingText((prevText) => (prevText + 1) % t.rotatingTexts.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [t.rotatingTexts.length]);

  const initialValues: AuthLoginData = {
    password: "",
    email: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email(t.invalidEmail)
      .required(t.fieldRequired),
    password: Yup.string().required(t.fieldRequired),
  });

  const onSubmit = async (values: AuthLoginData) => {
    try {
      const response = await loginUser(values);
      const userData = response.data;

      if (!userData.token || !userData.email) {
        throw new Error('Respuesta de servidor inválida');
      }

      const authData: AuthUser = {
        email: userData.email,
        first_name: userData.first_name ?? "Admin",
        last_name: userData.last_name ?? "Admin",
        token: userData.token,
        is_superuser: userData.is_superuser ?? false,
        uuid: userData.uuid,
      };

      sessionStorage.setItem("user_email", userData.email);
      sessionStorage.setItem("user_token", userData.token);

      await Promise.all([
        setAuth(authData),
        setNavElevation("builder")
      ]);

      navigate("/builder", { replace: true });

    } catch (error) {
      if (error instanceof Error) {
        ErrorToast(t.connectionError);
      } else {
        ErrorToast(error.message);
        setInputError({
          email: error.message === t.invalidEmail ? t.invalidEmail : "",
          password: error.message === t.invalidCredentials ? t.invalidCredentials : "",
        });
      }
    }
  };

  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
  });

  const { handleChange, values } = formik;

  const formSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setInputError({
      email: formik.errors.email || "",
      password: formik.errors.password || "",
    });
    formik.handleSubmit(e);
  };

  return (
    <Box sx={{
      textAlign: "center",
      height: "100vh",
      width: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Language Selector */}
      <Box sx={{
        position: 'absolute',
        top: 16,
        right: 16,
        zIndex: 3,
      }}>
        <LanguageSelector />
      </Box>

      {/* Snowfall Effect */}
      <Box sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden',
        zIndex: 1,
        pointerEvents: 'none',
      }}>
        <Snowfall
          snowflakeCount={200}
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            opacity: 0.034,
          }}
        />
      </Box>

      {/* Main Content */}
      <Box sx={{
        zIndex: 2,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(5px)',
        borderRadius: '15px',
        padding: '2rem',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        maxHeight: '80vh',
        overflowY: 'auto',
        width: { xs: '90%', sm: '75%', md: '50%', lg: '33%' }
      }}>
        <Box sx={{mb: "-152px"}}>
          <GlowingText>Gents</GlowingText>
        </Box>

        {showLoginForm ? (
          <>
            <Typography textAlign="center" sx={{ mt: 1 }}>
              {t.subtitle}
            </Typography>
            <Typography fontSize="75%" textAlign="center" sx={{ mt: 0.5, mb: 4 }}>
              {t.version}
            </Typography>
            {/* Login Form */}
            <form onSubmit={formSubmit}>
              <TextInput
                name="email"
                label={t.emailLabel}
                value={values.email}
                helperText={inputError.email}
                error={
                  inputError.email && inputError.email.trim() !== "" ? true : false
                }
                onChange={handleChange}
              />
              <PasswordInput
                name="password"
                label={t.passwordLabel}
                value={values.password}
                helperText={inputError.password}
                error={
                  inputError.password && inputError.password.trim() !== "" ? true : false
                }
                onChange={handleChange}
              />
              <Grid
                item
                xs={12}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  mt: 2,
                }}
              >
                <Button
                  variant="contained"
                  type="submit"
                  sx={{
                    paddingTop: "10px",
                    paddingBottom: "10px",
                    [theme.breakpoints.between("xs", "sm")]: {
                      maxWidth: "100%",
                    },
                  }}
                >
                  {t.loginButton}
                </Button>
              </Grid>
            </form>
          </>
        ) : (
          <>
            <motion.div
              key={rotatingText}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <Typography
                textAlign="center"
                variant="h5"
                sx={{
                  mt: 1,
                  mb: -2,
                  fontWeight: 'normal',
                  color: theme.palette.text.secondary,
                  textShadow: '0 0 5px rgba(0,0,0,0.3)',
                  minHeight: '3em',
                  lineHeight: '3em',
                  fontSize: '1.2rem',
                }}
              >
                {t.rotatingTexts[rotatingText]}
              </Typography>
            </motion.div>
            {/* Start Button */}
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
              <motion.div
                whileHover={{
                  scale: 1.1,
                  rotate: [0, -1, 1, -1, 0],
                  transition: { duration: 0.3 }
                }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => setShowLoginForm(true)}
                  sx={{
                    mb: 1,
                    fontSize: '1.5rem',
                    padding: '20px 40px',
                    borderRadius: '50px',
                    boxShadow: '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)',
                    backgroundColor: theme.palette.secondary.main,
                    color: theme.palette.secondary.contrastText,
                    '&:hover': {
                      color: "white",
                      backgroundColor: theme.palette.secondary.dark,
                    },
                  }}
                >
                  {t.startButton}
                </Button>
              </motion.div>
            </Grid>
          </>
        )}
      </Box>
    </Box>
  );
};

export default Login;

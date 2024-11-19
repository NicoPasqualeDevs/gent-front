import React, { useEffect, useState } from "react";
import { Button, Grid, Typography, Box, CircularProgress } from "@mui/material";
import * as Yup from "yup";
import { useFormik } from "formik";
import { AuthLoginData, AuthUser } from "@/types/Auth";
import useAuth from "@/hooks/useAuth";
import { ErrorToast } from "@/components/Toast";
import { useAppContext } from "@/context";
import { useNavigate } from "react-router-dom";
import { PasswordInput, TextInput } from "@/components/Inputs";
import { motion, AnimatePresence } from "framer-motion";
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
  const [isLoading, setIsLoading] = useState(false);

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
    setIsLoading(true);
    try {
      const response = await loginUser(values);
      const userData = response.data;

      if (!userData.token || !userData.email || !userData.uuid) {
        throw new Error(t.invalidServerResponse);
      }

      const authData: AuthUser = {
        email: userData.email,
        token: userData.token,
        uuid: userData.uuid,
        first_name: userData.first_name || "",
        last_name: userData.last_name || "",
        is_superuser: userData.is_superuser || false,
      };

      await Promise.all([
        setAuth(authData),
        setNavElevation("builder")
      ]);

      navigate("/builder", { replace: true });

    } catch (error: unknown) {
      if (error instanceof Error) {
        ErrorToast(t.connectionError);
      } else if (typeof error === 'object' && error !== null && 'message' in error) {
        const errorMessage = (error as { message: string }).message;
        ErrorToast(errorMessage);
        setInputError({
          email: errorMessage === t.invalidEmail ? t.invalidEmail : "",
          password: errorMessage === t.invalidCredentials ? t.invalidCredentials : "",
        });
      }
    } finally {
      setIsLoading(false);
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
      <Box
        component={motion.div}
        layout
        initial={false}
        animate={{
          height: showLoginForm ? "452px" : "360px",
        }}
        transition={{
          height: {
            duration: 0.5,
            ease: "anticipate",
            type: "spring",
            stiffness: 100,
            damping: 15
          }
        }}
        sx={{
          zIndex: 2,
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(5px)',
          borderRadius: '15px',
          padding: '2.rem',
          pt: '0rem',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          width: { xs: '90%', sm: '75%', md: '50%', lg: '33%' },
          overflow: 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative'
        }}
      >
        <motion.div
          initial={{ scale: 1 }}
          animate={{
            y: showLoginForm ? -0 : 0
          }}
          transition={{ duration: 0.5 }}
          style={{
            width: '100%',
            position: 'absolute',
            top: '-0px'
          }}
        >

          <GlowingText>gENTS</GlowingText>

        </motion.div>

        <AnimatePresence mode="wait">
          {showLoginForm ? (
            <motion.div
              key="loginForm"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5 }}
              style={{
                width: '80%',
                position: 'absolute',
                top: '296px'
              }}
            >
              <Box sx={{ mt: "-162px" }}>
                <Typography
                  textAlign="center"
                  color={theme.palette.secondary.light}
                  sx={{
                    fontSize: "12px",
                    mt: 0.5,
                    opacity: 0.85,
                    transform: 'translateY(0)',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {t.subtitle}
                </Typography>
                <Typography
                  fontSize="60%"
                  textAlign="center"
                  color={theme.palette.secondary.light}
                  sx={{
                    mt: 0.5,
                    mb: 2,
                    opacity: 0.85
                  }}
                >
                  {t.version}
                </Typography>
              </Box>

              <motion.form
                onSubmit={formSubmit}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <motion.div
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <TextInput
                    name="email"
                    label={t.emailLabel}
                    value={values.email}
                    helperText={inputError.email}
                    error={Boolean(inputError.email && inputError.email.trim())}
                    onChange={handleChange}
                  />
                </motion.div>

                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <PasswordInput
                    name="password"
                    label={t.passwordLabel}
                    value={values.password}
                    helperText={inputError.password}
                    error={Boolean(inputError.password && inputError.password.trim())}
                    onChange={handleChange}
                  />
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <Grid
                    item
                    xs={12}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      mt: 2,
                    }}
                  >
                    {isLoading ? (
                      <CircularProgress size={36} color="primary" />
                    ) : (
                      <Button
                        variant="contained"
                        type="submit"
                        sx={{
                          paddingTop: "10px",
                          paddingBottom: "10px",
                          color: theme.palette.primary.contrastText,
                          transition: 'all 0.3s ease',
                          [theme.breakpoints.between("xs", "sm")]: {
                            maxWidth: "100%",
                          },
                        }}
                      >
                        {t.loginButton}
                      </Button>
                    )}
                  </Grid>
                </motion.div>
              </motion.form>
            </motion.div>
          ) : (
            <motion.div
              key="welcomeScreen"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              style={{
                width: '100%',
                position: 'absolute',
                top: "296px"
              }}
            >
              <Box sx={{
                width: {
                  xs: "100%",
                  sm: "70%"
                },
                mr:"auto",
                ml:"auto",
                borderRadius:"24px",
              }}>
              <motion.div
                key={rotatingText}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <Typography
                  textAlign="center"
                  sx={{
                    mt: "-156px",
                    fontWeight: 'normal',
                    color: theme.palette.secondary.light,
                    textShadow: '0 0 5px rgba(0,0,0,0.3)',
                    lineHeight: '96px',
                    fontSize: {
                      xs: '18px',
                      sm: '20px',
                      md: '24px'
                    },
                    width: {
                      xs: '100%',
                      md: '100%'
                    },
                    mx: 'auto',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: {
                      xs: '-webkit-box',
                      sm: 'block'
                    },
                    WebkitLineClamp: {
                      xs: 1,
                      sm: 'unset'
                    },
                    WebkitBoxOrient: 'vertical'
                  }}
                >
                  {t.rotatingTexts[rotatingText]}
                </Typography>
                </motion.div>
              </Box>
              <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <motion.div
                  whileHover={{
                    scale: 1.05,
                    rotate: [0, -1, 1, -1, 0],
                    transition: { duration: 0.3 }
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => {
                      setShowLoginForm(true);
                    }}
                    sx={{
                      mb: 1,
                      fontSize: '1.5rem',
                      padding: '20px 40px',
                      borderRadius: '50px',
                      boxShadow: '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)',
                      backgroundColor: theme.palette.primary.main,
                      color: theme.palette.primary.contrastText,
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        backgroundColor: theme.palette.primary.light,
                        transform: 'translateY(-2px)',
                        boxShadow: '0 15px 25px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)',
                      },
                    }}
                  >
                    {t.startButton}
                  </Button>
                </motion.div>
              </Grid>
            </motion.div>
          )}
        </AnimatePresence>
      </Box>
    </Box>
  );
};

export default Login;

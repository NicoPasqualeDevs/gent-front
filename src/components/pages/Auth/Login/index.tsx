import { MainGridContainer } from "@/utils/ContainerUtil";
import { Button, Grid, Typography, Box } from "@mui/material";
import * as Yup from "yup";
import { useFormik } from "formik";
import { AuthLoginData } from "@/types/Auth";
import useAuth from "@/hooks/useAuth";
import { ErrorToast } from "@/components/Toast";
import { useAppContext } from "@/context/app";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { PasswordInput, TextInput } from "@/components/Inputs";
import { motion } from "framer-motion"; // Asegúrate de instalar framer-motion
import Snowfall from 'react-snowfall';
import { useTheme } from '@mui/material/styles';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { setAuthUser, setNavElevation } = useAppContext();
  const { loginUser } = useAuth();
  const [inputError, setInputError] = useState<AuthLoginData>({
    email: " ",
    code: " ",
  });
  const [showSnow] = useState(true);
  const [showLoginForm, setShowLoginForm] = useState(false); // Nueva variable de estado
  const theme = useTheme();

  const initialValues: AuthLoginData = {
    code: "",
    email: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Correo no válido")
      .required("Este campo es requerido"),
    code: Yup.string().required("Este campo es requerido"),
  });

  const onSubmit = (values: AuthLoginData) => {
    loginUser(values)
      .then((response) => {
        setAuthUser(response.data);
        sessionStorage.setItem("user_email", response.data.email);
        sessionStorage.setItem("user_token", response.data.token);
        setNavElevation("builder");
        navigate("/builder");
      })
      .catch((error) => {
        console.log(error);
        if (error instanceof Error) {
          ErrorToast("Error: no se pudo establecer conexión con el servidor");
        } else {
          ErrorToast(error.data.message);
          setInputError({
            email:
              error.data.message === "Correo no válido"
                ? "Correo no válido"
                : "",
            code:
              error.data.message === "Credenciales incorrectas"
                ? "Credenciales incorrectas"
                : "",
          });
        }
      });
  };

  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
  });

  const { handleChange, values } = formik;

  const formSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevenir el comportamiento por defecto del formulario
    setInputError({
      email: formik.errors.email || "",
      code: formik.errors.code || "",
    });
    formik.handleSubmit(e);
  };

  return (
    <MainGridContainer
      container
      alignItems={"center"}
      justifyContent={"center"}
      sx={{
        overflow: "hidden",
        position: 'relative',
        minHeight: '100vh',
      }}
    >
      {showSnow && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0, // Cambiado de height a bottom para cubrir toda la pantalla
            overflow: 'hidden',
            zIndex: 1,
            pointerEvents: 'none', // Permite que los clics pasen a través de la nieve
          }}
        >
          <Snowfall
            snowflakeCount={200}
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              opacity: 0.15, // Cambiado de 0.7 a 0.15
            }}
          />
        </Box>
      )}
      <Grid
        item
        xs={12}
        sm={8}
        md={6}
        lg={4}
        sx={{
          zIndex: 2,
          backgroundColor: 'rgba(255, 255, 255, 0.05)', // Cambiado de 0.1 a 0.05
          backdropFilter: 'blur(5px)', // Reducido de 10px a 5px
          borderRadius: '15px',
          padding: '2rem',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Grid item xs={12}>
          <Typography
            variant="h1"
            textAlign={"center"}
            sx={{
              mb: 1, // Añadido un pequeño margen inferior
            }}
          >
            Gents
          </Typography>
          {showLoginForm ? (
            <>
              <Typography textAlign={"center"} sx={{ mt: 1 }}>
                AI based project by Nicolas Pasquale
              </Typography>
              <Typography
                fontSize={"75%"}
                textAlign={"center"}
                sx={{
                  mt: 0.5,
                  mb: 4, // Añadido un margen inferior más grande
                }}
              >
                v 0.1
              </Typography>
            </>
          ) : (
            <Typography
              textAlign={"center"}
              variant="h6"
              sx={{
                mt: 0, // Cambiado de 2 a 0
                mb: 2, // Reducido de 4 a 2
                fontWeight: 'normal',
                color: theme.palette.text.secondary,
                // Añadido para mejorar la legibilidad si es necesario
                textShadow: '0 0 5px rgba(0,0,0,0.3)',
              }}
            >
              Crea tu equipo de Equipos IA con Inteligencia Artificial
            </Typography>
          )}
        </Grid>

        {showLoginForm ? (
          <Grid item xs={12} sx={{ mt: 2 }}> {/* Añadido un margen superior */}
            <form onSubmit={formSubmit}>
              <TextInput
                name="email"
                label="Email"
                value={values.email}
                helperText={inputError.email}
                error={
                  inputError.email && inputError.email.trim() !== "" ? true : false
                }
                onChange={handleChange}
              />
              <PasswordInput
                name="code"
                label="Código"
                value={values.code}
                helperText={inputError.code}
                error={
                  inputError.code && inputError.code.trim() !== "" ? true : false
                }
                onChange={handleChange}
              />
              <Grid
                item
                xs={12}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
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
                  Log In
                </Button>
              </Grid>
            </form>
          </Grid>
        ) : (
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}> {/* Aumentado de mt: 2 a mt: 6 */}
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
                  fontSize: '1.5rem', // Reducido de 2rem a 1.5rem
                  padding: '20px 40px', // Reducido de 30px 60px a 20px 40px
                  borderRadius: '50px',
                  boxShadow: '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)',
                  backgroundColor: theme.palette.secondary.main,
                  color: theme.palette.secondary.contrastText,
                  '&:hover': {
                    backgroundColor: theme.palette.secondary.dark,
                  },
                }}
              >
                Comenzar
              </Button>
            </motion.div>
          </Grid>
        )}
      </Grid>
    </MainGridContainer>
  );
};

export default Login;

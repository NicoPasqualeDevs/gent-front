import { MainGridContainer } from "@/utils/ContainerUtil";
import { Button, Grid, Typography } from "@mui/material";
import * as Yup from "yup";
import { useFormik } from "formik";
import { AuthLoginData } from "@/types/Auth";
import useAuth from "@/hooks/useAuth";
import { ErrorToast } from "@/components/Toast";
import { useAppContext } from "@/context/app";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { PasswordInput, TextInput } from "@/components/Inputs";
import theme from "@/styles/theme";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { setAuthUser, setNavElevation } = useAppContext();
  const { loginUser } = useAuth();
  const [inputError, setInputError] = useState<AuthLoginData>({
    email: " ",
    code: " ",
  });

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
        setNavElevation("clients");
        navigate("/clients");
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

  const formSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    setInputError({
      email: errors.email || "",
      code: errors.code || "",
    });
    handleSubmit(e);
  };

  const { handleSubmit, handleChange, errors, values } = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
  });

  return (
    <MainGridContainer
      container
      alignItems={"center"}
      sx={{
        overflow: "hidden",
      }}
    >
      <Grid
        container
        item
        xs={10}
        md={7}
        lg={5}
        component={"form"}
        onSubmit={formSubmit}
        gap={2}
      >
        <Grid item xs={12}>
          <Typography variant="h1" textAlign={"center"}>
            IA Maker
          </Typography>
          <Typography textAlign={"center"} marginTop={"-8px"}>
            by Helpia
          </Typography>
          <Typography fontSize={"75%"} textAlign={"center"} marginTop={"-5px"}>
            v 0.1.2
          </Typography>
        </Grid>
        <Grid item xs={12}>
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
        </Grid>
        <Grid item xs={12}>
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
        </Grid>
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
      </Grid>
    </MainGridContainer>
  );
};

export default Login;

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
      .email("correo no valido")
      .required("Este campo es requerido"),
    code: Yup.string().required("Este campo es requerido"),
  });

  const onSubmit = (values: AuthLoginData) => {
    loginUser(values)
      .then((response) => {
        setAuthUser(response);
        sessionStorage.setItem("user_email", response.email);
        sessionStorage.setItem("user_token", response.token);
        setNavElevation("clients");
        navigate("/clients");
      })
      .catch((error) => {
        if (error instanceof Error) {
          ErrorToast("Error: no se pudo establecer conexión con el servidor");
        } else {
          ErrorToast(
            `${error.status} - ${error.error} ${
              error.data ? ": " + error.data : ""
            }`
          );
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
    <MainGridContainer container alignItems={"center"}>
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
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <PasswordInput
            name="code"
            label="Código"
            value={values.code}
            helperText={inputError.code}
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
          <Button variant="contained" type="submit">
            Log In
          </Button>
        </Grid>
      </Grid>
    </MainGridContainer>
  );
};

export default Login;

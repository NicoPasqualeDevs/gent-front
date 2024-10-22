import { MainGridContainer } from "@/utils/ContainerUtil";
import { Button, Grid, Typography, Box } from "@mui/material";
import * as Yup from "yup";
import { useFormik } from "formik";
import { AuthRegisterData } from "@/types/Auth";
import useAuth from "@/hooks/useAuth";
import { ErrorToast, SuccessToast } from "@/components/Toast";
import { useAppContext } from "@/context/app";
import { useNavigate } from "react-router-dom";
import { PasswordInput, TextInput } from "@/components/Inputs";
import { motion } from "framer-motion";
import Snowfall from 'react-snowfall';
import { Link as RouterLink } from 'react-router-dom';
import { Link as MuiLink } from '@mui/material';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { setAuth } = useAppContext();
  const { registerUser } = useAuth();

  const initialValues: AuthRegisterData = {
    email: "",
    first_name: "",
    last_name: "",
    password: "",
    confirm_password: "",
    is_superuser: false,
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Correo electrónico no válido")
      .required("El correo electrónico es requerido"),
    first_name: Yup.string()
      .required("El nombre es requerido")
      .min(2, "El nombre debe tener al menos 2 caracteres"),
    last_name: Yup.string()
      .required("El apellido es requerido")
      .min(2, "El apellido debe tener al menos 2 caracteres"),
    password: Yup.string()
      .required("La contraseña es requerida")
      .min(8, "La contraseña debe tener al menos 8 caracteres")
      .matches(/[a-zA-Z]/, "La contraseña debe contener al menos una letra")
      .matches(/[0-9]/, "La contraseña debe contener al menos un número"),
    confirm_password: Yup.string()
      .oneOf([Yup.ref('password'), undefined], "Las contraseñas deben coincidir")
      .required("Confirmar la contraseña es requerido"),
  });

  const onSubmit = (values: AuthRegisterData) => {
    registerUser(values)
      .then((response) => {
        setAuth({
          uuid: response.data.uuid,
          email: response.data.email,
          first_name: response.data.first_name,
          last_name: response.data.last_name,
          token: response.data.token,
          is_superuser: response.data.is_superuser ?? false,
        });
        sessionStorage.setItem("user_email", response.data.email);
        sessionStorage.setItem("user_token", response.data.token);
        SuccessToast(response.message);
        navigate("/builder");
      })
      .catch((error) => {
        console.error(error);
        if (error instanceof Error) {
          ErrorToast("Error: no se pudo establecer conexión con el servidor");
        } else {
          ErrorToast(error.message || "Error en el registro");
        }
      })
  };

  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
  });

  const { handleSubmit, handleChange, values, touched, errors } = formik;

  return (
    <Grid
      item
      container
      xs={12}
      sm={12}
      md={10}
      lg={8}
      sx={{
        zIndex: 2,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(5px)',
        borderRadius: '15px',
        padding: '2rem',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        maxHeight: '90vh',
        overflowY: 'auto',
        margin: '0 auto',
        mt: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Typography
        variant="h1"
        textAlign={"center"}
        sx={{
          mb: 1, // Añadido un pequeño margen inferior
          fontSize: '1rem', // Aumentar el tamaño de la fuente del título
        }}
      >
        Gents
      </Typography>
      <Typography textAlign={"center"} sx={{ mt: 1, mb: 4 }}>
        Crea tu cuenta para comenzar
      </Typography>

      <form onSubmit={handleSubmit}>
        <TextInput
          name="email"
          label="Correo electrónico"
          value={values.email}
          onChange={handleChange}
          error={touched.email && Boolean(errors.email)}
          helperText={touched.email && errors.email ? errors.email : undefined}
        />
        <TextInput
          name="first_name"
          label="Nombre"
          value={values.first_name}
          onChange={handleChange}
          error={touched.first_name && Boolean(errors.first_name)}
          helperText={touched.first_name && errors.first_name ? errors.first_name : undefined}
        />
        <TextInput
          name="last_name"
          label="Apellido"
          value={values.last_name}
          onChange={handleChange}
          error={touched.last_name && Boolean(errors.last_name)}
          helperText={touched.last_name && errors.last_name ? errors.last_name : undefined}
        />
        <PasswordInput
          name="password"
          label="Contraseña"
          value={values.password}
          onChange={handleChange}
          error={touched.password && Boolean(errors.password)}
          helperText={touched.password && errors.password ? errors.password : undefined}
        />
        <PasswordInput
          name="confirm_password"
          label="Confirmar contraseña"
          value={values.confirm_password}
          onChange={handleChange}
          error={touched.confirm_password && Boolean(errors.confirm_password)}
          helperText={touched.confirm_password && errors.confirm_password ? errors.confirm_password : undefined}
        />
        <Grid
          item
          xs={12}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
            mt: 2,
          }}
        >
          <motion.div
            whileHover={{
              scale: 1.05,
              transition: { duration: 0.3 }
            }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="contained"
              type="submit"
              sx={{
                paddingTop: "10px",
                paddingBottom: "10px",
                width: "200px",
              }}
            >
              Registrarse
            </Button>
          </motion.div>
        </Grid>
      </form>
    </Grid>
  );
};

export default Register;

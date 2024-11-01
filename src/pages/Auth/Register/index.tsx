import { Box, Button, Typography, Paper, Container } from "@mui/material";
import * as Yup from "yup";
import { useFormik } from "formik";
import { AuthRegisterData } from "@/types/Auth";
import useAuth from "@/hooks/useAuth";
import { ErrorToast, SuccessToast } from "@/components/Toast";
import { useNavigate } from "react-router-dom";
import { PasswordInput, TextInput } from "@/components/Inputs";
import { motion } from "framer-motion";

const Register: React.FC = () => {
  const navigate = useNavigate();
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
        SuccessToast(response.message);
        navigate("/builder");
      })
      .catch((err) => {
        if (err) {
          ErrorToast(err.message || "Error en el registro");
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
    <Container maxWidth="xl" sx={{ py: 2, px: { xs: 1, sm: 2, md: 3 } }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Box component="form" onSubmit={handleSubmit} width="100%">
          <Typography variant="h4" gutterBottom>
            Registro de Usuario
          </Typography>
          
          <Box marginTop="20px">
            <TextInput
              name="email"
              label="Correo electrónico"
              value={values.email}
              onChange={handleChange}
              error={touched.email && Boolean(errors.email)}
              helperText={touched.email && errors.email ? errors.email : undefined}
            />
          </Box>

          <Box marginTop="20px">
            <TextInput
              name="first_name"
              label="Nombre"
              value={values.first_name}
              onChange={handleChange}
              error={touched.first_name && Boolean(errors.first_name)}
              helperText={touched.first_name && errors.first_name ? errors.first_name : undefined}
            />
          </Box>

          <Box marginTop="20px">
            <TextInput
              name="last_name"
              label="Apellido"
              value={values.last_name}
              onChange={handleChange}
              error={touched.last_name && Boolean(errors.last_name)}
              helperText={touched.last_name && errors.last_name ? errors.last_name : undefined}
            />
          </Box>

          <Box marginTop="20px">
            <PasswordInput
              name="password"
              label="Contraseña"
              value={values.password}
              onChange={handleChange}
              error={touched.password && Boolean(errors.password)}
              helperText={touched.password && errors.password ? errors.password : undefined}
            />
          </Box>

          <Box marginTop="20px">
            <PasswordInput
              name="confirm_password"
              label="Confirmar contraseña"
              value={values.confirm_password}
              onChange={handleChange}
              error={touched.confirm_password && Boolean(errors.confirm_password)}
              helperText={touched.confirm_password && errors.confirm_password ? errors.confirm_password : undefined}
            />
          </Box>

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
                marginTop: "20px",
                paddingTop: "10px",
                paddingBottom: "10px",
                width: "200px",
              }}
            >
              Registrarse
            </Button>
          </motion.div>
        </Box>
      </Paper>
    </Container>
  );
};

export default Register;

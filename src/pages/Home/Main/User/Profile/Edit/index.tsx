import React, { useCallback, useEffect, useState } from "react";
import { Box, Button, Typography, TextField } from "@mui/material";
// import { ErrorToast, SuccessToast } from "@/components/Toast";
// import useProfileApi from "@/hooks/useProfile";
// import { PageCircularProgress } from "@/components/CircularProgress";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useAppContext } from "@/context";
import { useNavigate } from "react-router-dom";

interface ProfileDetails {
  name: string;
  email: string;
  bio: string;
  role: string;
}

const ProfileEdit: React.FC = () => {
  const navigate = useNavigate();
  const { setNavElevation, replacePath } = useAppContext();
  // const { getProfileDetails, updateProfileDetails } = useProfileApi();

  const [loaded, setLoaded] = useState<boolean>(false);
  const [initialValues, setInitialValues] = useState<ProfileDetails>({
    name: "",
    email: "",
    bio: "",
    role: "",
  });
  const [inputError, setInputError] = useState<ProfileDetails>({
    name: "",
    email: "",
    bio: "",
    role: "",
  });

  const validationSchema = Yup.object({
    name: Yup.string().required("Este es un campo requerido"),
    email: Yup.string().email("Email inválido").required("Este es un campo requerido"),
    bio: Yup.string().required("Este es un campo requerido"),
    role: Yup.string().required("Este es un campo requerido"),
  });

  const onSubmit = (values: ProfileDetails) => {
    updateProfile(values);
  };

  const { values, errors, handleSubmit, handleChange, setValues } = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
  });

  const formSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    setInputError({
      name: errors.name || " ",
      email: errors.email || " ",
      bio: errors.bio || " ",
      role: errors.role || " ",
    });
    handleSubmit(e);
  };

  const getProfileData = useCallback(() => {
    // Simulación de respuesta de API
    setTimeout(() => {
      const mockResponse = {
        name: "Juan Pérez",
        email: "juan.perez@ejemplo.com",
        bio: "Desarrollador de software con 5 años de experiencia",
        role: "Desarrollador Senior",
      };
      setValues(mockResponse);
      setInitialValues(mockResponse);
      setLoaded(true);
    }, 1000);

    // Código comentado para la futura implementación de la API
    /*
    getProfileDetails()
      .then((response) => {
        setValues({
          name: response.name,
          email: response.email,
          bio: response.bio,
          role: response.role,
        });
        setInitialValues({
          name: response.name,
          email: response.email,
          bio: response.bio,
          role: response.role,
        });
        setLoaded(true);
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
    */
  }, []);

  const updateProfile = (values: ProfileDetails) => {
    // Simulación de actualización de perfil
    console.log("Perfil actualizado:", values);
    // SuccessToast("Perfil actualizado satisfactoriamente");
    navigate("/profile");

    // Código comentado para la futura implementación de la API
    /*
    updateProfileDetails(values)
      .then(() => {
        SuccessToast("Perfil actualizado satisfactoriamente");
        navigate("/profile");
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
    */
  };

  useEffect(() => {
    setLoaded(false);
    replacePath([
      {
        label: "Perfil",
        current_path: "/profile",
        preview_path: "",
        translationKey: "profile"
      },
      {
        label: "Editar",
        current_path: "/profile/edit",
        preview_path: "",
        translationKey: "edit"
      },
    ]);
    setNavElevation("profile");
    getProfileData();
  }, []);

  return (
    <Box component="form" onSubmit={formSubmit} width="100%">
      {!loaded ? (
        <Typography>Cargando...</Typography>
      ) : (
        <>
          <Typography variant="h4">Editar Perfil</Typography>
          <Box marginTop="20px">
            <TextField
              fullWidth
              name="name"
              label="Nombre"
              value={values.name}
              onChange={handleChange}
              error={!!inputError.name}
              helperText={inputError.name}
            />
          </Box>
          <Box marginTop="20px">
            <TextField
              fullWidth
              name="email"
              label="Email"
              value={values.email}
              onChange={handleChange}
              error={!!inputError.email}
              helperText={inputError.email}
            />
          </Box>
          <Box marginTop="20px">
            <TextField
              fullWidth
              name="role"
              label="Rol"
              value={values.role}
              onChange={handleChange}
              error={!!inputError.role}
              helperText={inputError.role}
            />
          </Box>
          <Box marginTop="30px">
            <TextField
              fullWidth
              name="bio"
              label="Biografía"
              value={values.bio}
              onChange={handleChange}
              error={!!inputError.bio}
              helperText={inputError.bio}
              multiline
              rows={6}
            />
          </Box>
          <Button
            variant="contained"
            type="submit"
            sx={{
              marginTop: "20px",
            }}
          >
            Guardar Cambios
          </Button>
        </>
      )}
    </Box>
  );
};

export default ProfileEdit;

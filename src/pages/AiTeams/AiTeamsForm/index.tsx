import React, { useCallback, useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import { AiTeamsDetails } from "@/types/AiTeams";
import { useNavigate } from "react-router-dom";
import { ErrorToast, SuccessToast } from "@/components/Toast";
import useCustomersApi from "@/hooks/useCustomers";
import { PageCircularProgress } from "@/components/CircularProgress";
import * as Yup from "yup";
import { useFormik } from "formik";
import { MultilineInput, TextInput } from "@/components/Inputs";
import { useAppContext } from "@/context/app";

const AiTeamsForm: React.FC = () => {
  const navigate = useNavigate();
  const { clientName, clientId } = useParams();
  const { setNavElevation, appNavigation, replacePath, setAgentsPage } =
    useAppContext();
  const { getClientDetails, postClientDetails, putClientDetails } =
    useCustomersApi();

  const [loaded, setLoaded] = useState<boolean>(false);
  const [initialValues, setInitialValues] = useState<AiTeamsDetails>({
    name: "",
    address: "",
    description: "",
    // Se eliminó model_ia
  });
  
  const [inputError, setInputError] = useState<AiTeamsDetails>({
    name: "",
    address: "",
    description: "",
    // Se eliminó model_ia
  });

  const validationSchema = Yup.object({
    name: Yup.string().required("Este es un campo requerido"),
    address: Yup.string().required("Este es un campo requerido"),
    description: Yup.string().required("Este es un campo requerido"),
    // Se eliminó la validación de model_ia
  });

  const onSubmit = (values: AiTeamsDetails) => {
    if (clientId) {
      updateClient(values, clientId);
    } else {
      createNewClient(values);
    }
  };

  const { values, errors, handleSubmit, handleChange, setValues } = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
  });

  const formSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    setInputError({
      name: errors.name || " ",
      address: errors.address || " ",
      description: errors.description || " ",
      // Se eliminó model_ia
    });
    handleSubmit(e);
  };

  const getClientData = useCallback((clientId: string) => {
    getClientDetails(clientId)
      .then((response) => {
        setValues({
          name: response.name,
          address: response.address,
          description: response.description,
          // Se eliminó model_ia
        });
        setInitialValues({
          name: response.name,
          address: response.address,
          description: response.description,
          // Se eliminó model_ia
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
  }, []);

  const updateClient = (values: AiTeamsDetails, clientId: string) => {
    putClientDetails(values, clientId)
      .then(() => SuccessToast("Cliente actualizado satisfactoriamente"))
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

  const createNewClient = (values: AiTeamsDetails) => {
    postClientDetails(values)
      .then((response) => {
        SuccessToast("Cliente creado satisfactoriamente");
        navigate(`/builder/form/${response.name}/${response.id}`);
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

  useEffect(() => {
    setLoaded(false);
    setValues({
      name: "",
      address: "",
      description: "",
    });
    setInitialValues({
      name: "",
      address: "",
      description: "",
    });
    if (clientId && clientName) {
      replacePath([
        ...appNavigation.slice(0, 2),
        {
          label: clientName,
          current_path: "/builder",
          preview_path: "",
        },
        {
          label: "Editar",
          current_path: `bots/builder/form/${clientId}`,
          preview_path: "",
        },
      ]);
      setNavElevation("builder");
      getClientData(clientId);
    } else {
      setAgentsPage(1);
      replacePath([
        {
          label: "Registrar Equipo",
          current_path: `bots/builder/form`,
          preview_path: "",
        },
      ]);
      setLoaded(true);
    }
  }, [clientId]);

  return (
    <Box component={"form"} onSubmit={formSubmit} width={"100%"}>
      {!loaded ? (
        <PageCircularProgress />
      ) : (
        <>
          <Typography variant="h4">
            {clientId ? "Editar equipo de Equipos IA" : "Registrar nuevo equipo de Equipos IA"}
          </Typography>
          <Box marginTop={"20px"}>
            <TextInput
              name="name"
              label="Nombre del Equipo"
              value={values.name}
              helperText={inputError.name}
              onChange={handleChange}
            />
          </Box>
          <Box marginTop={"20px"}>
            <TextInput
              name="address"
              label="Dirección"
              value={values.address}
              helperText={inputError.address}
              onChange={handleChange}
            />
          </Box>
          <Box marginTop={"30px"} >
            <MultilineInput
              name="description"
              label="Descripción"
              value={values.description}
              rows={6}
              helperText={inputError.description}
              onChange={handleChange}
            />
          </Box>
          <Button
            variant="contained"
            type="submit"
            sx={{
              marginTop: "10px",
            }}
          >
            {clientId ? "Editar" : "Registrar"}
          </Button>
        </>
      )}
    </Box>
  );
};

export default AiTeamsForm;

import React, { useCallback, useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import { ClientDetails } from "@/types/Clients";
import { useNavigate } from "react-router-dom";
import { ErrorToast, SuccessToast } from "@/components/Toast";
import useCustomersApi from "@/hooks/useCustomers";
import { PageCircularProgress } from "@/components/CircularProgress";
import * as Yup from "yup";
import { useFormik } from "formik";
import { MultilineInput, TextInput } from "@/components/Inputs";
import { useAppContext } from "@/context/app";

const ClientForm: React.FC = () => {
  const navigate = useNavigate();
  const { clientName, clientId } = useParams();
  const { setNavElevation, appNavigation, replacePath } = useAppContext();
  const { getClientDetails, postClientDetails, putClientDetails } =
    useCustomersApi();

  const [loaded, setLoaded] = useState<boolean>(false);
  const [initialValues, setInitialValues] = useState<ClientDetails>({
    name: "",
    address: "",
    description: "",
    model_ia: "",
  });
  const [inputError, setInputError] = useState<ClientDetails>({
    name: "",
    address: "",
    description: "",
    model_ia: "",
  });

  const validationSchema = Yup.object({
    name: Yup.string().required("Este es un campo requerido"),
    address: Yup.string().required("Este es un campo requerido"),
    description: Yup.string().required("Este es un campo requerido"),
    model_ia: Yup.string()
      .oneOf(
        ["gpt-3.5-turbo-1106", "gpt-4-1106-preview", "gpt-4o"],
        "no es un modelo válido"
      )
      .required("Este campo es requerido"),
  });

  const onSubmit = (values: ClientDetails) => {
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
      model_ia: errors.model_ia || " ",
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
          model_ia: response.model_ia,
        });
        setInitialValues({
          name: response.name,
          address: response.address,
          description: response.description,
          model_ia: response.model_ia,
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

  const updateClient = (values: ClientDetails, clientId: string) => {
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

  const createNewClient = (values: ClientDetails) => {
    postClientDetails(values)
      .then((response) => {
        SuccessToast("Cliente creado satisfactoriamente");
        navigate(`/clients/form/${response.name}/${response.id}`);
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
      model_ia: "",
    });
    setInitialValues({
      name: "",
      address: "",
      description: "",
      model_ia: "",
    });
    if (clientId && clientName) {
      replacePath([
        ...appNavigation.slice(0, 2),
        {
          label: clientName,
          current_path: "/clients",
          preview_path: "",
        },
        {
          label: "Editar",
          current_path: `bots/clients/form/${clientId}`,
          preview_path: "",
        },
      ]);
      setNavElevation("clients");
      getClientData(clientId);
    } else {
      replacePath([
        {
          label: "Registrar Cliente",
          current_path: `bots/clients/form`,
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
            {clientId ? "Editar Cliente" : "Registrar Nuevo Cliente"}
          </Typography>
          <Box marginTop={"20px"}>
            <TextInput
              name="name"
              label="Nombre del Cliente"
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
          <Box marginTop={"20px"}>
            <TextInput
              name="model_ia"
              label="Modelo de IA"
              value={values.model_ia}
              helperText={inputError.model_ia}
              placeholder="Modelos: gpt-3.5-turbo-1106, gpt-4-1106-preview, gpt-4o"
              onChange={handleChange}
            />
          </Box>
          <Typography>
            Modelos: gpt-3.5-turbo-1106, gpt-4-1106-preview, gpt-4o
          </Typography>
          <Box marginTop={"30px"}>
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

export default ClientForm;

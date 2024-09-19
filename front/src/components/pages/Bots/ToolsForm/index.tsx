import { PageCircularProgress } from "@/components/CircularProgress";
import { FileInput, MultilineInput, TextInput } from "@/components/Inputs";
import { ErrorToast, SuccessToast } from "@/components/Toast";
import { useAppContext } from "@/context/app";
import useBotsApi from "@/hooks/useBots";
import { ToolData } from "@/types/Bots";
import { Box, Button, Typography } from "@mui/material";
import { useFormik } from "formik";
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";

const ToolsForm: React.FC = () => {
  const navigate = useNavigate();
  const { replacePath, appNavigation } = useAppContext();
  const { toolName, toolId } = useParams();
  const { postTool, getTool, patchTool } = useBotsApi();

  const [loaded, setLoaded] = useState<boolean>(false);

  const [initialValues, setInitialValues] = useState<ToolData>({
    tool_name: "",
    tool_code: "",
    instruction: "",
  });
  const [inputError, setInputError] = useState<ToolData>({
    tool_name: "",
    tool_code: "",
    instruction: "",
  });
  const validationSchema = Yup.object({
    tool_name: toolId
      ? Yup.string()
      : Yup.string().required("Este campo es requerido"),
    tool_code: toolId
      ? Yup.mixed()
      : Yup.mixed().required("Este campo es requerido"),
    instruction: toolId
      ? Yup.string()
      : Yup.string().required("Este campo es requerido"),
  });

  const onSubmit = (values: ToolData) => {
    if (toolId) {
      updateTool(toolId, values);
    } else {
      createNewTool(values);
    }
  };

  const { handleSubmit, handleChange, errors, values, setValues } = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
  });

  const formSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    setInputError({
      tool_name: errors.tool_name || " ",
      tool_code: errors.tool_code || " ",
      instruction: errors.instruction || " ",
    });
    handleSubmit(e);
  };

  const createNewTool = (values: ToolData) => {
    const formData = new FormData();
    formData.append("tool_name", values.tool_name);
    formData.append("instruction", values.instruction ?? "");
    formData.append("tool_code", values.tool_code ?? "");

    postTool(formData)
      .then(() => {
        SuccessToast("Tool creada satisfactoriamente");
        navigate(`/bots/tools`);
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

  const getToolData = useCallback((toolId: string) => {
    getTool(toolId)
      .then((response) => {
        const { tool_name, tool_code, instruction } = response;
        const data = {
          tool_name: tool_name || "",
          instruction: instruction || "",
          tool_code: tool_code || "",
        };
        if (response.tool_code && typeof response.tool_code === "string") {
          const xhr = new XMLHttpRequest();
          const tool_code = response.tool_code;
          xhr.open("GET", tool_code, true);
          xhr.responseType = "blob";
          xhr.onload = () => {
            if (xhr.status === 200) {
              const fileBlob = new Blob([xhr.response], {
                type: "application/octet-stream",
              });
              const fullFileName = tool_code.split("/").pop() || "";
              const file = new File([fileBlob], fullFileName, {
                type: fileBlob.type,
              });
              data.tool_code = file;
              setValues(data);
              setInitialValues(data);
              setLoaded(true);
            }
          };
          xhr.onerror = () => {
            console.error("Error: no se pudo obtener el archivo.");
            setLoaded(true);
          };
          xhr.send();
        } else {
          setValues(data);
          setInitialValues(data);
          setLoaded(true);
        }
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

  const updateTool = (toolId: string, values: ToolData) => {
    const formData = new FormData();
    formData.append("tool_name", values.tool_name);
    formData.append("instruction", values.instruction ?? "");
    formData.append("tool_code", values.tool_code ?? "");

    patchTool(toolId, formData)
      .then(() => {
        SuccessToast("Tool actualizada satisfactoriamente");
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
    if (toolId) {
      replacePath([
        ...appNavigation.slice(0, 3),
        {
          label: "Editar",
          current_path: `/bots/tools-form/${toolName}/${toolId}`,
          preview_path: "",
        },
      ]);
      getToolData(toolId);
    } else {
      setLoaded(true);
    }
  }, [toolId]);

  return (
    <>
      {!loaded ? (
        <PageCircularProgress />
      ) : (
        <Box component={"form"} onSubmit={formSubmit}>
          <Typography variant="h4">
            {toolName ? `Editar ${toolName}` : "Crear Nueva Tool"}
          </Typography>
          <Box marginTop={"20px"}>
            <TextInput
              name="tool_name"
              label="Nombre de Tool"
              value={values.tool_name}
              helperText={inputError.tool_name}
              onChange={handleChange}
            />
          </Box>
          <Box marginTop={"20px"}>
            <TextInput
              name="type"
              label="Tipo de Tool"
              value={values.type}
              helperText={inputError.type}
              onChange={handleChange}
              disabled={true}
            />
          </Box>
          <Box marginTop={"20px"}>
            <MultilineInput
              name="instruction"
              label="Instrucciones"
              rows={9}
              value={values.instruction}
              helperText={inputError.instruction}
              onChange={handleChange}
            />
          </Box>
          <Box marginTop={"20px"}>
            <FileInput
              name="tool_code"
              label="Archivo de Tool"
              onChange={handleChange}
              value={values.tool_code}
              helperText={inputError.tool_code}
            />
          </Box>
          <Button variant="contained" type="submit" sx={{ marginTop: "20px" }}>
            {toolId ? "Actualizar" : "Crear"}
          </Button>
        </Box>
      )}
    </>
  );
};

export default ToolsForm;

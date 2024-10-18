import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Button,
  Typography,
  Container,
  Paper,
  Grid,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";

import { PageCircularProgress } from "@/components/CircularProgress";
import { FileInput, MultilineInput, TextInput } from "@/components/Inputs";
import { ErrorToast, SuccessToast } from "@/components/Toast";
import { useAppContext } from "@/context/app";
import useBotsApi from "@/hooks/useBots";
import { ToolData } from "@/types/Bots";
import { languages } from "@/utils/Traslations";

const ToolsForm: React.FC = () => {
  const navigate = useNavigate();
  const { replacePath, appNavigation, language } = useAppContext();
  const { toolName, toolId } = useParams();
  const { postTool, getTool, patchTool } = useBotsApi();
  const t = languages[language as keyof typeof languages];

  const [loaded, setLoaded] = useState<boolean>(false);
  const [initialValues, setInitialValues] = useState<ToolData>({
    tool_name: "",
    tool_code: "",
    instruction: "",
  });
  const [fileError, setFileError] = useState<string>("");

  const validationSchema = Yup.object({
    tool_name: toolId
      ? Yup.string()
      : Yup.string().required(t.toolsForm.required),
    tool_code: toolId
      ? Yup.mixed()
      : Yup.mixed()
          .required(t.toolsForm.required)
          .test("fileType", t.toolsForm.onlyPyFiles, (value) => {
            if (!value) return true;
            if (typeof value === 'string') return value.toLowerCase().endsWith('.py');
            return value instanceof File && value.name.toLowerCase().endsWith('.py');
          }),
    instruction: toolId
      ? Yup.string()
      : Yup.string().required(t.toolsForm.required),
  });

  const onSubmit = (values: ToolData) => {
    const formData = new FormData();
    formData.append("tool_name", values.tool_name);
    formData.append("instruction", values.instruction ?? "");
    if (values.tool_code instanceof File) {
      formData.append("tool_code", values.tool_code);
    }

    if (toolId) {
      updateTool(toolId, formData);
    } else {
      createNewTool(formData);
    }
  };

  const { handleSubmit, handleChange, errors, values, setValues } = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
  });

  const createNewTool = (formData: FormData) => {
    postTool(formData)
      .then(() => {
        SuccessToast(t.toolsForm.createSuccess);
        navigate(`/builder/agents/tools`);
      })
      .catch((error) => {
        if (error instanceof Error) {
          ErrorToast(t.toolsForm.connectionError);
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
            console.error(t.toolsForm.fileError);
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
          ErrorToast(t.toolsForm.connectionError);
        } else {
          ErrorToast(
            `${error.status} - ${error.error} ${
              error.data ? ": " + error.data : ""
            }`
          );
        }
      });
  }, []);

  const updateTool = (toolId: string, formData: FormData) => {
    patchTool(toolId, formData)
      .then(() => {
        SuccessToast(t.toolsForm.updateSuccess);
      })
      .catch((error) => {
        if (error instanceof Error) {
          ErrorToast(t.toolsForm.connectionError);
        } else {
          ErrorToast(
            `${error.status} - ${error.error} ${
              error.data ? ": " + error.data : ""
            }`
          );
        }
      });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement> | { target: { name: string; value: File; } }) => {
    const file = 'files' in event.target ? event.target.files?.[0] : event.target.value;
    if (file) {
      if (file.name.toLowerCase().endsWith(".py")) {
        setValues({ ...values, tool_code: file });
        setFileError("");
      } else {
        setFileError(t.toolsForm.onlyPyFiles);
        if ('files' in event.target) event.target.value = "";
      }
    }
  };

  useEffect(() => {
    setLoaded(false);
    if (toolId) {
      replacePath([
        ...appNavigation.slice(0, 3),
        {
          label: t.toolsForm.edit,
          current_path: `/builder/agents/tools-form/${toolName}/${toolId}`,
          preview_path: "",
        },
      ]);
      getToolData(toolId);
    } else {
      setLoaded(true);
    }
  }, [toolId]);

  return (
    <Container maxWidth="xl" sx={{ py: 2, px: { xs: 1, sm: 2, md: 3 } }}>
      {!loaded ? (
        <PageCircularProgress />
      ) : (
        <Box component="form" onSubmit={handleSubmit}>
          <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h5" sx={{ mb: 3 }}>
              {toolName ? t.toolsForm.editTool.replace("{toolName}", toolName) : t.toolsForm.createNewTool}
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextInput
                  name="tool_name"
                  label={t.toolsForm.toolName}
                  value={values.tool_name}
                  helperText={errors.tool_name}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextInput
                  name="type"
                  label={t.toolsForm.toolType}
                  value={values.type}
                  helperText={errors.type}
                  onChange={handleChange}
                  disabled={true}
                />
              </Grid>
              <Grid item xs={12}>
                <MultilineInput
                  name="instruction"
                  label={t.toolsForm.instructions}
                  rows={6}
                  value={values.instruction}
                  helperText={errors.instruction}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <FileInput
                  name="tool_code"
                  label={t.toolsForm.toolFile}
                  onChange={handleFileChange}
                  value={values.tool_code}
                  helperText={fileError || errors.tool_code}
                />
              </Grid>
            </Grid>
          </Paper>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              type="submit"
              sx={{
                color: 'white',
                '&:hover': {
                  color: 'white',
                },
              }}
            >
              {toolId ? t.toolsForm.update : t.toolsForm.create}
            </Button>
          </Box>
        </Box>
      )}
    </Container>
  );
};

export default ToolsForm;

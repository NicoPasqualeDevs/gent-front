import React, { useEffect, useState } from "react";
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
  const { language } = useAppContext();
  const { postTool, } = useBotsApi();
  const t = languages[language as keyof typeof languages];
  const { aiTeamId, botId, toolId, toolName, botName } = useParams<{ aiTeamId: string, botId: string, toolId: string, toolName: string, botName: string }>();

  console.log(aiTeamId, "aiTeamId", botId, "botId", toolId, "toolId", toolName, "toolName", botName, "botName" , "<-- paramas")

  const [fileError, setFileError] = useState<string>("");

  const initialValues: ToolData = {
    tool_name: "",
    tool_code: "",
    instruction: "",
    aiTeam_id: aiTeamId || "",  // Usamos aiTeamId del parámetro de la URL
  };

  const validationSchema = Yup.object({
    tool_name: Yup.string().required(t.toolsForm.required),
    tool_code: Yup.mixed()
      .required(t.toolsForm.required)
      .test("fileType", t.toolsForm.onlyPyFiles, (value) => {
        if (!value) return true;
        if (typeof value === 'string') return value.toLowerCase().endsWith('.py');
        return value instanceof File && value.name.toLowerCase().endsWith('.py');
      }),
    instruction: Yup.string().required(t.toolsForm.required),
    client_ids: Yup.array().of(Yup.string()).min(1, "Cliente requerido"),
  });

  const createNewTool = (formData: FormData) => {
    postTool(formData)
      .then((response) => {
        SuccessToast(t.toolsForm.createSuccess);
        navigate(`/builder/agents/tools/${aiTeamId}/${botId}`);
      })
      .catch((error) => {
        if (error instanceof Error) {
          ErrorToast(t.toolsForm.connectionError);
        } else {
          ErrorToast(
            `${error.status} - ${error.error} ${error.data ? ": " + error.data : ""}`
          );
        }
      });
  };

  const onSubmit = (values: ToolData) => {
    const formData = new FormData();
    formData.append("tool_name", values.tool_name);
    formData.append("instruction", values.instruction ?? "");
    if (values.tool_code instanceof File) {
      formData.append("tool_code", values.tool_code);
    }
    if (values.aiTeam_id) {
      formData.append("aiTeam_id", values.aiTeam_id);
    }

    createNewTool(formData);
  };

  const { handleSubmit, handleChange, setFieldValue, errors, values } = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement> | { target: { name: string; value: File; } }) => {
    const file = 'files' in event.target ? event.target.files?.[0] : event.target.value;
    if (file) {
      if (file.name.toLowerCase().endsWith(".py")) {
        setFieldValue("tool_code", file);
        setFileError("");
      } else {
        setFileError(t.toolsForm.onlyPyFiles);
        if ('files' in event.target) event.target.value = "";
      }
    }
  };

  useEffect(() => {

  }, []);

  return (
    <Container maxWidth="xl" sx={{ py: 2, px: { xs: 1, sm: 2, md: 3 } }}>
      <Box component="form" onSubmit={handleSubmit}>
        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h5" sx={{ mb: 3 }}>
            {t.toolsForm.createNewTool}
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
{/*             <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="aiTeam-select-label">{t.toolsForm.aiTeam}</InputLabel>
                <Select
                  labelId="aiTeam-select-label"
                  id="aiTeam-select"
                  value={aiTeamId || ""}
                  label={t.toolsForm.aiTeam}
                  onChange={(e) => setFieldValue("client_ids", [e.target.value])}
                >
                  {aiTeams.map((aiTeam) => (
                    <MenuItem key={aiTeam.id} value={aiTeam.id}>
                      {aiTeam.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {errors.client_ids && <Typography color="error">{errors.client_ids}</Typography>}
            </Grid> */}
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
            {t.toolsForm.create}
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default ToolsForm;

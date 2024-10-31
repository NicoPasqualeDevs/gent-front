import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Button,
  Typography,
  Paper,
  Container,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import {
  ErrorToast,
  SuccessToast,
} from "@/components/Toast";
import useBotsApi from "@/hooks/useBots";
import useAdmin from "@/hooks/useAdmin"; // Importamos el nuevo hook
import { PageCircularProgress } from "@/components/CircularProgress";
import * as Yup from "yup";
import { useFormik } from "formik";
import { MultilineInput, TextInput } from "@/components/Inputs";
import { useAppContext } from "@/context/app";
import { languages } from "@/utils/Traslations";
import { ToolData } from "@/types/Bots";

// Definimos el tipo NonSuperUser
type NonSuperUser = { id: number; username: string; email: string; first_name: string; last_name: string };

const ToolsForm: React.FC = () => {
  const navigate = useNavigate();
  const { toolId } = useParams();
  const { language, auth } = useAppContext();
  const { postTool, patchTool, getTool } = useBotsApi();
  const { listNonSuperUsers } = useAdmin(); // Utilizamos el nuevo hook
  const t = languages[language as keyof typeof languages].toolsForm;

  const [loaded, setLoaded] = useState<boolean>(false);
  const [isToolDataLoaded, setIsToolDataLoaded] = useState<boolean>(false);
  const [initialValues, setInitialValues] = useState<ToolData>({
    tool_name: "",
    instruction: "",
    tool_code: undefined,
    user_id: auth.user?.uuid,
  });

  const [nonSuperUsers, setNonSuperUsers] = useState<NonSuperUser[]>([]);

  const validationSchema = Yup.object({
    tool_name: Yup.string().required(t.fieldRequired),
    instruction: Yup.string().required(t.fieldRequired),
    tool_code: Yup.mixed().required(t.fieldRequired),
    user_id: Yup.string().required(t.fieldRequired),
  });

  const onSubmit = (values: ToolData) => {
    const formData = new FormData();
    
    // Agregar cada campo al FormData y hacer console.log para debug
    if (values.tool_name) {
        formData.append('tool_name', values.tool_name);
        console.log('Appending tool_name:', values.tool_name);
    }
    if (values.instruction) {
        formData.append('instruction', values.instruction);
        console.log('Appending instruction:', values.instruction);
    }
    if (values.tool_code) {
        formData.append('tool_code', values.tool_code);
        console.log('Appending tool_code:', values.tool_code);
    }
    if (values.user_id) {
        // Asegurarnos de que estamos enviando el ID numérico
        const numericId = Number(values.user_id);
        formData.append('user_id', numericId.toString());
        console.log('Appending user_id:', numericId);
    }

    // Agregar console.log para ver el FormData completo
    for (const pair of formData.entries()) {
        console.log(pair[0], pair[1]);
    }

    if (toolId) {
        updateTool(formData, toolId);
    } else {
        createNewTool(formData);
    }
  };

  const { values, errors, handleSubmit, handleChange, setFieldValue, setValues } = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
  });

  const formSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSubmit(e);
  };

  const getToolData = useCallback((toolId: string) => {
    return getTool(toolId)
      .then((response) => {
        const newValues = {
          tool_name: response.tool_name,
          instruction: response.instruction || "",
          tool_code: response.tool_code,
          user_id: auth.user?.uuid,
        };
        setValues(newValues);
        setInitialValues(newValues);
      })
      .catch(() => {
        ErrorToast(t.errorConnection);
      });
  }, [getTool, t.errorConnection]);

  const initializeUsers = useCallback(() => {
    if (!auth.user) return;
    
    const currentUser = {
      id: Number(auth.user.uuid),
      username: auth.user.first_name,
      email: auth.user.email,
      first_name: auth.user.first_name,
      last_name: auth.user.last_name || ''
    };

    if (!auth.user.is_superuser) {
      setNonSuperUsers([currentUser]);
      return;
    }

    listNonSuperUsers()
      .then((response) => {
        const newUsers = response.data.map(user => ({
          ...user,
          id: Number(user.id)
        }));
        setNonSuperUsers([currentUser, ...newUsers]);
      })
      .catch((error) => {
        console.error("Error al obtener usuarios no superusuarios:", error);
        setNonSuperUsers([currentUser]);
      });
  }, [listNonSuperUsers]);

  // Efecto principal para la carga inicial
  useEffect(() => {
    const initializeData = async () => {
      setLoaded(false);
      setIsToolDataLoaded(false);

      try {
        if (toolId) {
          await getToolData(toolId);
        }
        await initializeUsers();
      } finally {
        setIsToolDataLoaded(true);
        setLoaded(true);
      }
    };

    initializeData();
  }, [toolId]);

  // Efecto separado para manejar el user_id
  useEffect(() => {
    if (auth?.user?.uuid && !values.user_id) {
      setFieldValue('user_id', auth.user.uuid);
    }
  }, [auth?.user?.uuid]);

  const updateTool = (formData: FormData, toolId: string) => {
    patchTool(toolId, formData)
      .then(() => SuccessToast(t.successUpdate))
      .catch(() => {
        ErrorToast(t.errorConnection);
      })
  };

  const createNewTool = (formData: FormData) => {
    console.log('Sending form data to server...');
    postTool(formData)
        .then((response) => {
            console.log('Server response:', response);
            SuccessToast(t.successCreate);
            navigate(-1);
        })
        .catch((error) => {
            console.error('Error creating tool:', error);
            ErrorToast(error.message || t.errorConnection);
        });
  };

  return (
    <Container maxWidth="xl" sx={{ py: 2, px: { xs: 1, sm: 2, md: 3 } }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Box 
          component="form" 
          onSubmit={formSubmit} 
          width="100%" 
          encType="multipart/form-data"
        >
          {!loaded ? (
            <PageCircularProgress />
          ) : (
            <>
              <Typography variant="h4" gutterBottom>
                {toolId ? t.editTool.replace("{toolName}", values.tool_name) : t.createNewTool}
              </Typography>
              <Box marginTop={"20px"}>
                <TextInput
                  name="tool_name"
                  label={t.toolName}
                  value={values.tool_name}
                  helperText={errors.tool_name}
                  onChange={handleChange}
                />
              </Box>
              <Box marginTop={"30px"}>
                <MultilineInput
                  name="instruction"
                  label={t.instructions}
                  value={values.instruction}
                  rows={6}
                  helperText={errors.instruction}
                  onChange={handleChange}
                />
              </Box>
              <Box marginTop={"20px"}>
                <input
                  type="file"
                  accept=".py,.js,.ts" // Especificar tipos de archivo permitidos
                  onChange={(event) => {
                    const file = event.currentTarget.files?.[0];
                    if (file) {
                      console.log('Selected file:', file);
                      setFieldValue("tool_code", file);
                    }
                  }}
                />
                {errors.tool_code && <Typography color="error">{errors.tool_code}</Typography>}
              </Box>

                <Box marginTop={"20px"}>
                  <FormControl fullWidth>
                    <InputLabel id="user-select-label">{t.selectUser}</InputLabel>
                    <Select
                      labelId="user-select-label"
                      id="user-select"
                      value={values.user_id || ''}
                      label={t.selectUser}
                      onChange={(e) => {
                        setFieldValue('user_id', e.target.value);
                      }}
                      name="user_id"
                    >
                      {nonSuperUsers.map((user) => (
                        <MenuItem key={user.id} value={user.id.toString()}>
                          {user.username} - {user.email}
                          {user.id === Number(auth?.user?.uuid) && ` (${t.currentUser})`}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>

              <Button
                variant="contained"
                type="submit"
                sx={{
                  marginTop: "20px",
                }}
              >
                {toolId ? t.edit : t.create}
              </Button>
            </>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default ToolsForm;

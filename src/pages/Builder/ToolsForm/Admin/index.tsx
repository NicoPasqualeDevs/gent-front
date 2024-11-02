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
import useTools from "@/hooks/useTools"; // Importar el nuevo hook
import { 
  FormLayout, 
  FormHeader, 
  FormContent, 
  FormInputGroup,
  FormButton,
  FormActions,
  FormFileInput,
  FormCancelButton,
  FormTextField,
  FormSelect
} from "@/utils/FormsViewUtils";

// Definir interfaz para el usuario autenticado
interface AuthUser {
  uuid: string;
  first_name: string;
  email: string;
  last_name?: string;
  is_superuser: boolean;
}

interface AuthContextExtended {
  user: AuthUser | null;
}

// Actualizar el tipo NonSuperUser
type NonSuperUser = {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
};

const ToolsForm: React.FC = () => {
  const navigate = useNavigate();
  const { toolId } = useParams();
  const { language, auth } = useAppContext();
  const { postTool, patchTool, getTool } = useTools(); // Usar el nuevo hook
  const { listNonSuperUsers } = useAdmin(); // Utilizamos el nuevo hook
  const t = languages[language as keyof typeof languages].toolsForm;

  const [loaded, setLoaded] = useState<boolean>(false);
  const [isToolDataLoaded, setIsToolDataLoaded] = useState<boolean>(false);
  const [initialValues, setInitialValues] = useState<ToolData>({
    tool_name: "",
    instruction: "",
    tool_code: undefined,
    user_id: auth?.uuid || "",
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
        if (response?.data) {
          const newValues = {
            tool_name: response.data.tool_name,
            instruction: response.data.instruction || "",
            tool_code: response.data.tool_code,
            user_id: auth?.uuid || "",
          };
          setValues(newValues);
          setInitialValues(newValues);
        }
      })
      .catch(() => {
        ErrorToast(t.errorConnection);
      });
  }, [getTool, t.errorConnection, auth?.uuid]);

  const initializeUsers = useCallback(() => {
    if (!auth?.uuid) return;
    
    const currentUser = {
      id: Number(auth.uuid),
      username: auth.first_name,
      email: auth.email,
      first_name: auth.first_name,
      last_name: auth.last_name || ''
    };

    if (!auth.is_superuser) {
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
  }, [listNonSuperUsers, auth]);

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
    if (auth?.uuid && !values.user_id) {
      setFieldValue('user_id', auth.uuid);
    }
  }, [auth?.uuid]);

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
        .then((response: any) => {
            console.log('Server response:', response);
            SuccessToast(t.successCreate);
            navigate(-1);
        })
        .catch((error: any) => {
            console.error('Error creating tool:', error);
            ErrorToast(error.message || t.errorConnection);
        });
  };

  return (
    <FormLayout>
      <FormHeader 
        title={toolId ? t.editTool.replace("{toolName}", values.tool_name) : t.createNewTool}
      />

      <FormContent 
        onSubmit={formSubmit}
        encType="multipart/form-data"
      >
        {!loaded ? (
          <PageCircularProgress />
        ) : (
          <>
            <FormInputGroup>
              <FormTextField
                name="tool_name"
                label={t.toolName}
                value={values.tool_name}
                onChange={handleChange}
                error={Boolean(errors.tool_name)}
                helperText={errors.tool_name}
              />
            </FormInputGroup>

            <FormInputGroup>
              <FormTextField
                name="instruction"
                label={t.instructions}
                value={values.instruction}
                onChange={handleChange}
                multiline
                rows={6}
                error={Boolean(errors.instruction)}
                helperText={errors.instruction}
              />
            </FormInputGroup>

            <FormInputGroup>
              <FormFileInput
                accept=".py,.js,.ts"
                onChange={(file) => {
                  console.log('Selected file:', file);
                  setFieldValue("tool_code", file);
                }}
                error={errors.tool_code}
              />
            </FormInputGroup>

            <FormInputGroup>
              <FormSelect
                labelId="user-select-label"
                label={t.selectUser}
                value={values.user_id || ''}
                onChange={(e) => {
                  setFieldValue('user_id', e.target.value);
                }}
                name="user_id"
              >
                {nonSuperUsers.map((user) => (
                  <MenuItem key={user.id} value={user.id.toString()}>
                    {user.username} - {user.email}
                    {user.id === Number(auth?.uuid) && ` (${t.currentUser})`}
                  </MenuItem>
                ))}
              </FormSelect>
            </FormInputGroup>

            <FormActions>
              <FormCancelButton
                onClick={() => navigate(-1)}
                disabled={!isToolDataLoaded}
              >
                {t.cancel}
              </FormCancelButton>
              <FormButton
                type="submit"
                variant="contained"
                disabled={!isToolDataLoaded}
              >
                {toolId ? t.edit : t.create}
              </FormButton>
            </FormActions>
          </>
        )}
      </FormContent>
    </FormLayout>
  );
};

export default ToolsForm;

import { Button, Grid, Typography, MenuItem } from "@mui/material";
import { useParams } from "react-router-dom";
import { ContextEntryData } from "@/types/Bots";
import { useNavigate } from "react-router-dom";
import useBotsApi from "@/hooks/useBots";
import { useEffect, useState, useCallback } from "react";
import { PageCircularProgress } from "@/components/CircularProgress";
import { ErrorToast, SuccessToast } from "@/components/Toast";
import { useFormik } from "formik";
import * as Yup from "yup";
import { MultilineInput, TextInput, SelectInput } from "@/components/Inputs";
import { useAppContext } from "@/context/app";

const ContextEntry: React.FC = () => {
  const { clientId, botId } = useParams();
  const navigate = useNavigate();
  const { replacePath, appNavigation } = useAppContext();
  const {
    getBotData,
    getPromptTemplate,
    createBot,
    updateBot,
    postPromptTemplate,
  } = useBotsApi();
  const [loaded, setLoaded] = useState<boolean>(false);
  const [inputError, setInputError] = useState<ContextEntryData>({
    name: "",
    description: "",
    prompt_template: "",
    model_ai: "",
  });

  const [initialValues, setInitialValues] = useState<ContextEntryData>({
    description: "",
    name: "",
    prompt_template: "",
    model_ai: "claude-3-5-sonnet-20240620", // Valor por defecto
  });

  const validationSchema = Yup.object({
    description: Yup.string().required("Descripción es un campo requerido"),
    name: Yup.string().required("Nombre es un campo requerido"),
    prompt_template: botId
      ? Yup.string().required("Prompt Template es un campo requerido")
      : Yup.string().optional(),
    model_ai: Yup.string().required("Modelo AI es un campo requerido"),
  });

  const onSubmit = (values: ContextEntryData) => {
    if (botId) {
      updateBotData(values);
    } else {
      createNewBot(values);
    }
  };

  const { values, errors, handleSubmit, handleChange, setValues } = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
  });

  const loadPromptTemplateData = useCallback(
    (name: string, description: string, model_ai: string) => {
      if (botId) {
        getPromptTemplate(botId)
          .then((response) => {
            setInitialValues({
              name: name,
              description: description,
              prompt_template: response.data,
              model_ai: model_ai || "claude-3-5-sonnet-20240620", // Usar Claude 3.5 si no hay valor
            });
            setValues({
              name: name,
              description: description,
              prompt_template: response.data,
              model_ai: model_ai || "claude-3-5-sonnet-20240620", // Usar Claude 3.5 si no hay valor
            });
            setLoaded(true);
          })
          .catch((error) => {
            ErrorToast(
              `${error.status} - ${error.error} ${
                error.data ? ": " + error.data : ""
              }`
            );
            setTimeout(() => {
              navigate(-1);
            }, 1000);
          });
      }
    },
    []
  );

  const updatePromptTemplateData = (prompt_template: string) => {
    if (botId) {
      postPromptTemplate(botId, { prompt_template })
        .then(() => SuccessToast("Información actualizada satisfactoriamente"))
        .catch((error) => {
          ErrorToast(
            `${error.status} - ${error.error} ${
              error.data ? ": " + error.data : ""
            }`
          );
          setTimeout(() => {
            navigate(-1);
          }, 1000);
        });
    }
  };

  const loadBotData = useCallback(() => {
    if (botId) {
      getBotData(botId)
        .then((response) => {
          loadPromptTemplateData(
            response.data.name ?? '',
            response.data.description ?? '',
            Array.isArray(response.data.model_ai) ? response.data.model_ai.join(', ') : (response.data.model_ai ?? '')
          );
        })
        .catch((error) => {
          ErrorToast(
            `${error.status} - ${error.error} ${
              error.data ? ": " + error.data : ""
            }`
          );
          setTimeout(() => {
            navigate(-1);
          }, 1000);
        });
    }
  }, []);

  const createNewBot = (values: ContextEntryData) => {
    if (clientId) {
      createBot(clientId, {
        name: values.name,
        description: values.description,
        model_ai: values.model_ai 
      })
        .then((response) => {
          SuccessToast("Bot creado satisfactoriamente");
          setTimeout(() => {
            navigate(`/bots/contextEntry/${clientId}/${response.id}`);
          }, 1000);
        })
        .catch((error) => {
          ErrorToast(
            `${error.status} - ${error.error} ${
              error.data ? ": " + error.data : ""
            }`
          );
          setTimeout(() => {
            navigate(-1);
          }, 1000);
        });
    } else {
      ErrorToast(
        "Error al cargar clientId en la vista. No se puede crear el bot."
      );
      setTimeout(() => {
        navigate(-1);
      }, 1000);
    }
  };

  const updateBotData = (values: ContextEntryData) => {
    if (clientId && botId) {
      updateBot(botId, { name: values.name, description: values.description, model_ai: values.model_ai })
        .then(() => {
          updatePromptTemplateData(values.prompt_template);
        })
        .catch((error) => {
          ErrorToast(
            `${error.status} - ${error.error} ${
              error.data ? ": " + error.data : ""
            }`
          );
          setTimeout(() => {
            navigate(-1);
          }, 1000);
        });
    } else {
      ErrorToast(
        "Error al cargar botId o clientId en la vista. No se pueden actualizar los datos."
      );
      setTimeout(() => {
        navigate(-1);
      }, 1000);
    }
  };

  useEffect(() => {
    if (clientId) {
      if (botId) {
        /*setAppNavigation({
          label: "Editar Agente",
          current_path: `/bots/contextEntry/${clientId}/${botId}`,
          preview_path: `/bots/contextEntry/${clientId}`,
        });*/
        replacePath([
          ...appNavigation.slice(0, 2),
          {
            label: "Editar Agente",
            current_path: `/bots/contextEntry/${clientId}/${botId}`,
            preview_path: `/bots/contextEntry/${clientId}`,
          },
        ]);
        loadBotData();
      } else {
        replacePath([
          ...appNavigation.slice(0, 2),
          {
            label: "Crear Agente",
            current_path: `/bots/contextEntry/${clientId}/`,
            preview_path: `/bots/contextEntry/${clientId}`,
          },
        ]);
        setLoaded(true);
      }
    } else {
      ErrorToast("Error al cargar clientId en el vista");
      setTimeout(() => {
        navigate(-1);
      }, 1000);
    }
  }, []);

  const modelAIOptions = [
    { label: "Claude 3.5", value: "claude-3-5-sonnet-20240620" },
    { label: "Claude 3 Opus", value: "claude-3-opus-20240229" },
    { label: "GPT-4", value: "gpt-4o" },
    { label: "GPT-3.5", value: "gpt-3.5-turbo-1106" },
  ];

  return (
    <>
      {!loaded ? (
        <PageCircularProgress />
      ) : (
        <Grid
          container
          component={"form"}
          onSubmit={(e) => {
            setInputError({
              name: errors.name || "",
              description: errors.description || "",
              prompt_template: errors.prompt_template || "",
              model_ai: errors.model_ai || "",
            });
            handleSubmit(e);
          }}
          gap={2}
        >
          <Grid item xs={12}>
            <Typography variant="h4">
              {botId ? "Editar" : "Crear Agente"}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <TextInput
              name="name"
              label="Nombre"
              value={values.name}
              helperText={inputError.name}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <MultilineInput
              name="description"
              label="Descripción"
              value={values.description}
              rows={6}
              helperText={inputError.description}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <SelectInput
              name="model_ai"
              label="Modelo AI"
              value={values.model_ai}
              onChange={handleChange}
              helperText={inputError.model_ai}
              required
            >
              {modelAIOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </SelectInput>
          </Grid>
          {botId ? (
            <Grid item xs={12}>
              <MultilineInput
                name="prompt_template"
                label="Prompt Template"
                value={values.prompt_template}
                rows={17}
                helperText={inputError.prompt_template}
                onChange={handleChange}
              />
            </Grid>
          ) : null}
          <Grid item xs={12} sx={{ mt: 2 }}>
            <Button variant="contained" type="submit">
              Guardar
            </Button>
          </Grid>
        </Grid>
      )}
    </>
  );
};

export default ContextEntry;
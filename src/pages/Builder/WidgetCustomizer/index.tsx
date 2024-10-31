import { StyledPageTitle } from "@/components/styledComponents/Typography";
import useBotsApi from "@/hooks/useBots";
import { WidgetData, CustomGreetingData, NewGreetingData } from "@/types/Bots";
import { Grid, Box, Tabs, Tab } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { StyledDefaultButton, StyledDangerButton } from "@/components/styledComponents/Buttons";
import { ErrorToast, SuccessToast } from "@/components/Toast";
import { PageCircularProgress } from "@/components/CircularProgress";
import {
  MultilineInput,
  TextInput,
  ImageInput,
  CheckboxInput,
} from "@/components/Inputs";
import { ShortInput } from "../CustomMessages/Inputs";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useAppContext } from "@/context/app";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`widget-tabpanel-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export const WidgetCustomizer: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const { replacePath, appNavigation } = useAppContext();
  const [widgetData, setWidgetData] = useState<WidgetData>({ id: "" });
  const { getWidget, patchWidget, getCustomMessages, postCustomMessages, putCustomMessage, deleteCustomMessage } = useBotsApi();
  const { botId } = useParams();

  // Estados para mensajes personalizados
  const [messages, setMessages] = useState<CustomGreetingData[]>([]);
  const [newMessage, setNewMessage] = useState<NewGreetingData>({
    bot: "",
    text: "",
  });
  let emptyMessagesTemplate: CustomGreetingData[] = [];

  // Configuración del formulario y validación
  const initialValues: WidgetData = {
    id: "",
    primary_color: "",
    primary_textContrast: "",
    secondary_color: "",
    secondary_textContrast: "",
    badge_color: "",
    badge_contrast: "",
    font_family: "",
    brand_alt: "",
    brand_logo: "",
    icon_bot: "",
    icon_chat: "",
    icon_hidden: "",
    icon_send: "",
    sql_injection_tester: true,
    php_injection_tester: true,
    strange_chars_tester: true,
    band_list: "",
  };

  const validationSchema = Yup.object({
    primary_color: Yup.string(),
    primary_textContrast: Yup.string(),
    secondary_color: Yup.string(),
    secondary_textContrast: Yup.string(),
    badge_color: Yup.string(),
    badge_contrast: Yup.string(),
    font_family: Yup.string(),
    brand_alt: Yup.string(),
    brand_logo: Yup.string(),
    icon_bot: Yup.string(),
    icon_chat: Yup.string(),
    icon_hidden: Yup.string(),
    icon_send: Yup.string(),
    sql_injection_tester: Yup.boolean(),
    php_injection_tester: Yup.boolean(),
    strange_chars_tester: Yup.boolean(),
    band_list: Yup.string(),
  });

  const [inputError, setInputError] = useState({
    primary_color: " ",
    primary_textContrast: " ",
    secondary_color: " ",
    secondary_textContrast: " ",
    badge_color: " ",
    badge_contrast: " ",
    font_family: " ",
    brand_alt: " ",
    brand_logo: " ",
    icon_bot: " ",
    icon_chat: " ",
    icon_hidden: " ",
    icon_send: " ",
    sql_injection_tester: " ",
    php_injection_tester: " ",
    strange_chars_tester: " ",
    band_list: " ",
  });

  const setHelperText = () => {
    setInputError({
      primary_color: errors.primary_color ? errors.primary_color : " ",
      primary_textContrast: errors.primary_textContrast
        ? errors.primary_textContrast
        : " ",
      secondary_color: errors.secondary_color ? errors.secondary_color : " ",
      secondary_textContrast: errors.secondary_textContrast
        ? errors.secondary_textContrast
        : " ",
      badge_color: errors.badge_color ? errors.badge_color : " ",
      badge_contrast: errors.badge_contrast ? errors.badge_contrast : " ",
      font_family: errors.font_family ? errors.font_family : " ",
      brand_alt: errors.brand_alt ? errors.brand_alt : " ",
      brand_logo: errors.brand_logo ? errors.brand_logo : " ",
      icon_bot: errors.icon_bot ? errors.icon_bot : " ",
      icon_chat: errors.icon_chat ? errors.icon_chat : " ",
      icon_hidden: errors.icon_hidden ? errors.icon_hidden : " ",
      icon_send: errors.icon_send ? errors.icon_send : " ",
      sql_injection_tester: errors.sql_injection_tester
        ? errors.sql_injection_tester
        : " ",
      php_injection_tester: errors.php_injection_tester
        ? errors.php_injection_tester
        : " ",
      strange_chars_tester: errors.strange_chars_tester
        ? errors.strange_chars_tester
        : " ",
      band_list: errors.band_list ? errors.band_list : " ",
    });
  };

  const onSubmit = (values: WidgetData) => {
    let data: WidgetData = {
      id: widgetData.id,
    };
    Object.entries(widgetData).map(([key, value]) => {
      if (value !== values[key]) {
        data = { ...data, [key]: values[key] };
      }
    });
    patchWidget(widgetData.id, data)
      .then(() => SuccessToast("Widget actualizado correctamente"))
      .catch((error) => ErrorToast(`Error: ${error.status} - ${error.error}`));
  };

  const { handleSubmit, handleChange, errors, values } = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
  });

  const getWidgetData = useCallback((botId: string): void => {
    getWidget(botId)
      .then((response) => {
        setIsLoaded(true);
        setWidgetData(response);
        initialValues.id = response.id;
        initialValues.customer_bot = response.customer_bot;
        initialValues.primary_color = response.primary_color || "";
        initialValues.primary_textContrast =
          response.primary_textContrast || "";
        initialValues.secondary_color = response.secondary_color || "";
        initialValues.secondary_textContrast =
          response.secondary_textContrast || "";
        initialValues.badge_color = response.badge_color || "";
        initialValues.badge_contrast = response.badge_contrast || "";
        initialValues.font_family = response.font_family || "";
        initialValues.faq_questions = response.faq_questions || "";
        initialValues.brand_alt = response.brand_alt || "";
        initialValues.brand_logo = response.brand_logo || "";
        initialValues.icon_bot = response.icon_bot || "";
        initialValues.icon_chat = response.icon_chat || "";
        initialValues.icon_hidden = response.icon_hidden || "";
        initialValues.icon_send = response.icon_send || "";
        initialValues.sql_injection_tester = response.sql_injection_tester;
        initialValues.php_injection_tester = response.php_injection_tester;
        initialValues.strange_chars_tester = response.strange_chars_tester;
        initialValues.band_list = response.band_list || "";
      })
      .catch((error) => {
        console.log(error, "<-- getWidget");
        setIsLoaded(true);
      });
  }, []);

  // Funciones para mensajes personalizados
  const getCustomMessagesData = useCallback((botId: string): void => {
    getCustomMessages(botId)
      .then((response) => {
        emptyMessagesTemplate = [...response.data];
        setMessages([...response.data]);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleUpdate = (index: number) => {
    // ... (mantener la lógica existente de handleUpdate)
  };

  const handleDelete = (index: number) => {
    // ... (mantener la lógica existente de handleDelete)
  };

  const handleNew = () => {
    // ... (mantener la lógica existente de handleNew)
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Efectos y carga inicial
  useEffect(() => {
    if (botId) {
      replacePath([
        ...appNavigation.slice(0, 2),
        {
          label: "Widget",
          current_path: `bots/widgetCustomizer/${botId}`,
          preview_path: "",
        },
      ]);
      Promise.all([
        getWidgetData(botId),
        getCustomMessagesData(botId)
      ]).then(() => {
        setIsLoaded(true);
        setNewMessage({ ...newMessage, bot: botId });
      });
    }
  }, [botId]);

  return (
    <>
      {!isLoaded ? (
        <PageCircularProgress />
      ) : (
        <Box sx={{ width: '100%' }}>
          <StyledPageTitle>Widget Customizer</StyledPageTitle>
          
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mt: 2 }}>
            <Tabs value={tabValue} onChange={handleTabChange}>
              <Tab label="Colores" />
              <Tab label="Tipografía" />
              <Tab label="Imágenes" />
              <Tab label="Seguridad" />
              <Tab label="Saludos" />
            </Tabs>
          </Box>

          {/* Pestaña de Colores */}
          <TabPanel value={tabValue} index={0}>
            <Grid container component={"form"} gap={2}>
              <Grid item xs={12}>
                <TextInput
                  name="primary_color"
                  label="Color Primario"
                  placeholder="Ingrese código hexadecimal de color"
                  helperText={inputError.primary_color}
                  value={values.primary_color}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextInput
                  name="primary_textContrast"
                  label="Color de Texto Primario"
                  placeholder="Ingrese código hexadecimal de color"
                  helperText={inputError.primary_textContrast}
                  value={values.primary_textContrast}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextInput
                  name="secondary_color"
                  label="Color Secundario"
                  placeholder="Ingrese código hexadecimal de color"
                  helperText={inputError.secondary_color}
                  value={values.secondary_color}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextInput
                  name="secondary_textContrast"
                  label="Color de Texto Secundario"
                  placeholder="Ingrese código hexadecimal de color"
                  helperText={inputError.secondary_textContrast}
                  value={values.secondary_textContrast}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextInput
                  name="badge_color"
                  label="Color de Badge"
                  placeholder="Ingrese código hexadecimal de color"
                  helperText={inputError.badge_color}
                  value={values.badge_color}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextInput
                  name="badge_contrast"
                  label="Color de texto del Badge"
                  placeholder="Ingrese código hexadecimal de color"
                  helperText={inputError.badge_contrast}
                  value={values.badge_contrast}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>
          </TabPanel>

          {/* Pestaña de Tipografía */}
          <TabPanel value={tabValue} index={1}>
            <Grid container component={"form"} gap={2}>
              <Grid item xs={12}>
                <TextInput
                  name="font_family"
                  label="Tipo de Fuente"
                  placeholder="Ingrese el valor de atributo font-family deseado"
                  helperText={inputError.font_family}
                  value={values.font_family}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <MultilineInput
                  name="faq_questions"
                  label="Preguntas Frecuentes"
                  placeholder={`Ingrese las preguntas, en el siguiente formato:
                          pregunta #1 | pregunta #2 | etc... 
                          utilice el caracter "|" para separar las preguntas`}
                  value={values.faq_questions}
                  helperText={errors.faq_questions}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <MultilineInput
                  name="band_list"
                  label="Palabras Baneadas"
                  placeholder={`Ingrese las palabras, en el siguiente formato:
                          palabra #1 | palabra #2 | etc... 
                          utilice el caracter "|" para separar las palabras`}
                  helperText={errors.band_list}
                  value={values.band_list}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>
          </TabPanel>

          {/* Pestaña de Imágenes */}
          <TabPanel value={tabValue} index={2}>
            <Grid container component={"form"} gap={2}>
              <Grid item xs={12}>
                <TextInput
                  name="brand_alt"
                  label="Texto alternativo de Logo"
                  placeholder="Ingrese el texto alternativo"
                  helperText={errors.brand_alt}
                  value={values.brand_alt}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={6}>
                <ImageInput
                  name="brand_logo"
                  label="Logo de Cliente"
                  onChange={handleChange}
                  value={values.brand_logo ? true : false}
                />
              </Grid>
              <Grid item xs={6}>
                <ImageInput
                  name="icon_bot"
                  label="Ícono de bot"
                  onChange={handleChange}
                  value={values.icon_bot ? true : false}
                />
              </Grid>
              <Grid item xs={6}>
                <ImageInput
                  name="icon_chat"
                  label="Ícono de chat"
                  onChange={handleChange}
                  value={values.icon_chat ? true : false}
                />
              </Grid>
              <Grid item xs={6}>
                <ImageInput
                  name="icon_hidden"
                  label="Ícono de ocultar"
                  onChange={handleChange}
                  value={values.icon_hidden ? true : false}
                />
              </Grid>
              <Grid item xs={6}>
                <ImageInput
                  name="icon_send"
                  label="Ícono de enviar"
                  onChange={handleChange}
                  value={values.icon_send ? true : false}
                />
              </Grid>
            </Grid>
          </TabPanel>

          {/* Pestaña de Seguridad */}
          <TabPanel value={tabValue} index={3}>
            <Grid container component={"form"} gap={2}>
              <Grid item xs={12}>
                <CheckboxInput
                  name="sql_injection_tester"
                  label="Comprobación de Inyección de SQL"
                  onChange={handleChange}
                  value={values.sql_injection_tester}
                />
              </Grid>
              <Grid item xs={12}>
                <CheckboxInput
                  name="php_injection_tester"
                  label="Comprobación de Inyección de PHP"
                  onChange={handleChange}
                  value={values.php_injection_tester}
                />
              </Grid>
              <Grid item xs={12}>
                <CheckboxInput
                  name="strange_chars_tester"
                  label="Comprobación de uso de caracteres extraños"
                  onChange={handleChange}
                  value={values.strange_chars_tester}
                />
              </Grid>
            </Grid>
          </TabPanel>

          {/* Pestaña de Saludos */}
          <TabPanel value={tabValue} index={4}>
            <Box>
              <Box sx={{ mt: 2 }}>
                {messages.map((item, index) => (
                  <Box
                    display={"flex"}
                    gap={1}
                    marginTop={"10px"}
                    key={`greeting-${index}`}
                  >
                    <ShortInput
                      propKey="text"
                      emptyTemplate={emptyMessagesTemplate[index]}
                      baseDetails={item}
                    />
                    <StyledDefaultButton onClick={() => handleUpdate(index)}>
                      Actualizar
                    </StyledDefaultButton>
                    <StyledDangerButton onClick={() => handleDelete(index)}>
                      Borrar
                    </StyledDangerButton>
                  </Box>
                ))}
              </Box>

              <Box sx={{ mt: 4 }}>
                <h3>Crear nuevo mensaje</h3>
                <Box display={"flex"} gap={1} marginTop={"10px"}>
                  <ShortInput
                    propKey="text"
                    emptyTemplate={newMessage}
                    baseDetails={newMessage}
                  />
                  <StyledDefaultButton onClick={handleNew}>
                    Crear
                  </StyledDefaultButton>
                </Box>
              </Box>
            </Box>
          </TabPanel>

          {/* Botón de Submit general */}
          <Box sx={{ mt: 3, mb: 2 }}>
            <StyledDefaultButton
              sx={{ fontSize: "16px", maxWidth: "150px" }}
              onClick={() => {
                setHelperText();
                handleSubmit();
              }}
              type="submit"
            >
              Guardar Cambios
            </StyledDefaultButton>
          </Box>
        </Box>
      )}
    </>
  );
};

export default WidgetCustomizer;

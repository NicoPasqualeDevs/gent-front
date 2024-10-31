import { StyledPageTitle } from "@/components/styledComponents/Typography";
import useBotsApi from "@/hooks/useBots";
import { WidgetData, CustomGreetingData, NewGreetingData } from "@/types/Bots";
import { Grid, Box, Tabs, Tab } from "@mui/material";
import React, { useCallback, useEffect, useState, useRef } from "react";
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
import { ShortInput } from "@/components/Inputs/ShortInput";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useAppContext } from "@/context/app";
import { ReactWidget } from './components/ReactWidget';
import { useTheme } from '@mui/material/styles';
import { ColorInput } from "@/components/Inputs/ColorInput";

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
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const { replacePath, appNavigation } = useAppContext();
  const [widgetData, setWidgetData] = useState<WidgetData>({ id: "" });
  const { getWidget, patchWidget, getCustomMessages } = useBotsApi();
  const { botId } = useParams();  // Estados para mensajes personalizados
  const [messages, setMessages] = useState<CustomGreetingData[]>([]);
  const [newMessage, setNewMessage] = useState<NewGreetingData>({
    bot: "",
    text: "",
  });
  let emptyMessagesTemplate: CustomGreetingData[] = [];

  // Configuración del formulario y validación
  const initialValues: WidgetData = {
    id: "",
    primary_color: theme.palette.primary.main,
    primary_textContrast: theme.palette.primary.contrastText,
    secondary_color: theme.palette.secondary.main,
    secondary_textContrast: theme.palette.secondary.contrastText,
    badge_color: theme.palette.primary.light,
    badge_contrast: theme.palette.primary.contrastText,
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

  const { handleSubmit, handleChange, errors, values, setValues } = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
  });

  const getWidgetData = useCallback((botId: string): void => {
    getWidget(botId)
      .then((response) => {
        const defaultedResponse = {
          ...response,
          primary_color: response.primary_color || theme.palette.primary.main,
          primary_textContrast: response.primary_textContrast || theme.palette.primary.contrastText,
          secondary_color: response.secondary_color || theme.palette.secondary.main,
          secondary_textContrast: response.secondary_textContrast || theme.palette.secondary.contrastText,
          badge_color: response.badge_color || theme.palette.primary.light,
          badge_contrast: response.badge_contrast || theme.palette.primary.contrastText,
        };
        
        setWidgetData(defaultedResponse);
        setValues({
          ...values,
          ...defaultedResponse
        });
        setIsLoaded(true);
      })
      .catch((error) => {
        const fallbackData = {
          id: "",
          primary_color: theme.palette.primary.main,
          primary_textContrast: theme.palette.primary.contrastText,
          secondary_color: theme.palette.secondary.main,
          secondary_textContrast: theme.palette.secondary.contrastText,
          badge_color: theme.palette.primary.light,
          badge_contrast: theme.palette.primary.contrastText,
        };
        
        setWidgetData(fallbackData);
        setValues({
          ...values,
          ...fallbackData
        });
        setIsLoaded(true);
      });
  }, [theme.palette, setValues, values]);

  // Funciones para mensajes personalizados
  const getCustomMessagesData = useCallback((botId: string): Promise<void> => {
    return getCustomMessages(botId)
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
      
      // Primero cargar los datos del widget
      getWidgetData(botId);
      // Luego cargar los mensajes personalizados
      getCustomMessagesData(botId).then(() => {
        setNewMessage({ ...newMessage, bot: botId });
      });
    }
  }, [botId]);

  // Agregar esta referencia al inicio del componente, junto con los otros estados
  const colorUpdateTimeout = useRef<ReturnType<typeof setTimeout>>();

  // Modificar el handleChange para actualizar widgetData inmediatamente
  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    

    
    // Limpiar el timeout anterior si existe
    if (colorUpdateTimeout.current) {
      clearTimeout(colorUpdateTimeout.current);
    }
    
    // Crear nuevo timeout para actualizar widgetData
    colorUpdateTimeout.current = setTimeout(() => {
    handleChange(e);
      setWidgetData(prevData => ({
        ...prevData,
        [name]: value
      }));
    }, 125);
  };

  return (
    <>
      {!isLoaded ? (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          height: '100%'
        }}>
          <PageCircularProgress />
        </Box>
      ) : (
        <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
          <StyledPageTitle sx={{ mb: 0 }}>Widget Customizer</StyledPageTitle>

          {/* Contenedor principal con background */}
          <Box sx={{ 
            flex: 1,
            bgcolor: 'background.paper',
            borderRadius: 1,
            boxShadow: 1,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            mt: 2
          }}>
            {/* Tabs */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={tabValue} onChange={handleTabChange}>
                <Tab label="Colores" />
                <Tab label="Tipografía" />
                <Tab label="Imágenes" />
                <Tab label="Seguridad" />
                <Tab label="Saludos" />
              </Tabs>
            </Box>

            {/* Contenedor del contenido */}
            <Box sx={{ 
              display: 'flex',
              gap: 4,
              flex: 1,
              p: 3,
              minHeight: 0
            }}>
              {/* Panel izquierdo - Widget Preview */}
              <Box sx={{ 
                width: '40%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <ReactWidget widgetData={{
                  primary_color: widgetData.primary_color || theme.palette.primary.main,
                  primary_textContrast: widgetData.primary_textContrast || theme.palette.primary.contrastText,
                  secondary_color: widgetData.secondary_color || theme.palette.secondary.main,
                  secondary_textContrast: widgetData.secondary_textContrast || theme.palette.secondary.contrastText,
                  badge_color: widgetData.badge_color || theme.palette.primary.light,
                  badge_contrast: widgetData.badge_contrast || theme.palette.primary.contrastText,
                  font_family: widgetData.font_family || '',
                  brand_alt: widgetData.brand_alt || '',
                  brand_logo: widgetData.brand_logo || '',
                  icon_bot: widgetData.icon_bot || '',
                  icon_chat: widgetData.icon_chat || '',
                  icon_hidden: widgetData.icon_hidden || '',
                  icon_send: widgetData.icon_send || '',
                }} />
              </Box>

              {/* Panel derecho - Opciones de configuración */}
              <Box sx={{ 
                width: '60%',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
              }}>
                {/* Contenedor scrolleable de opciones */}
                <Box sx={{ 
                  flex: 1,
                  overflow: 'auto',
                  '& .MuiTabPanel-root': {
                    p: 0,
                    pb: 2
                  },
                  '& .MuiGrid-container': {
                    rowGap: 2
                  }
                }}>
                  {/* Pestaña de Colores */}
                  <TabPanel value={tabValue} index={0}>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <ColorInput
                          name="primary_color"
                          label="Color Primario"
                          value={values.primary_color ?? ""}
                          onChange={handleColorChange}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <ColorInput
                          name="primary_textContrast"
                          label="Color de Texto Primario"
                          value={values.primary_textContrast ?? ""}
                          onChange={handleColorChange}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <ColorInput
                          name="secondary_color"
                          label="Color Secundario"
                          value={values.secondary_color ?? ""}
                          onChange={handleColorChange}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <ColorInput
                          name="secondary_textContrast"
                          label="Color de Texto Secundario"
                          value={values.secondary_textContrast ?? ""}
                          onChange={handleColorChange}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <ColorInput
                          name="badge_color"
                          label="Color de Badge"
                          value={values.badge_color ?? ""}
                          onChange={handleColorChange}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <ColorInput
                          name="badge_contrast"
                          label="Color de texto del Badge"
                          value={values.badge_contrast ?? ""}
                          onChange={handleColorChange}
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
                          helperText={inputError.font_family ?? " "}
                          value={values.font_family ?? ""}
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
                          value={values.faq_questions ?? ""}
                          helperText={errors.faq_questions ?? " "}
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
                          helperText={errors.band_list ?? " "}
                          value={values.band_list ?? ""}
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
                          helperText={errors.brand_alt ?? " "}
                          value={values.brand_alt ?? ""}
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
                              emptyData={emptyMessagesTemplate[index]}
                              data={item}
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
                            emptyData={newMessage}
                            data={newMessage}
                          />
                          <StyledDefaultButton onClick={handleNew}>
                            Crear
                          </StyledDefaultButton>
                        </Box>
                      </Box>
                    </Box>
                  </TabPanel>
                </Box>
                  <StyledDefaultButton
                    onClick={() => {
                      setHelperText();
                      handleSubmit();
                    }}
                    type="submit"
                    sx={{ mt: 1 , alignSelf: 'flex-end'}}
                  >
                    Guardar Cambios
                  </StyledDefaultButton>
                </Box>
              </Box>
          </Box>
        </Box>
      )}
    </>
  );
};

export default WidgetCustomizer;

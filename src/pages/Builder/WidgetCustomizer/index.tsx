import { StyledPageTitle } from "@/components/styledComponents/Typography";
import useWidget from "@/hooks/useWidget";
import { WidgetData, CustomGreetingData, NewGreetingData } from "@/types/Bots";
import { Grid, Box, Tabs, Tab, Paper, Button } from "@mui/material";
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
import { ApiResponse } from "@/types/Api";
import {
  DashboardContainer,
  DashboardHeader,
  DashboardContent,
  DashboardFooter,
  commonStyles
} from "@/utils/DashboardsUtils";

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

// Componente para la pestaña de Colores
const ColorsTab: React.FC<{
  values: any;
  handleColorChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ values, handleColorChange }) => (
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
);

// Definir tipos para los eventos
type FormikHandleChange = {
  (e: React.ChangeEvent<any>): void;
  <T = string | React.ChangeEvent<any>>(field: T): T extends React.ChangeEvent<any>
    ? void
    : (e: string | React.ChangeEvent<any>) => void;
};

type ImageInputEvent = {
  target: {
    name: string;
    value: string;
  };
};

// Actualizar las interfaces de los componentes
interface TypographyTabProps {
  values: any;
  handleChange: FormikHandleChange;
  inputError: any;
}

interface ImagesTabProps {
  values: any;
  handleChange: (event: ImageInputEvent) => void;
  errors: any;
}

interface SecurityTabProps {
  values: any;
  handleChange: FormikHandleChange;
}

// Actualizar los componentes con los nuevos tipos
const TypographyTab: React.FC<TypographyTabProps> = ({ values, handleChange, inputError }) => (
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
        helperText={inputError.faq_questions ?? " "}
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
        helperText={inputError.band_list ?? " "}
        value={values.band_list ?? ""}
        onChange={handleChange}
      />
    </Grid>
  </Grid>
);

const ImagesTab: React.FC<ImagesTabProps> = ({ values, handleChange, errors }) => (
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
);

const SecurityTab: React.FC<SecurityTabProps> = ({ values, handleChange }) => (
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
);

// Componente para la pestaña de Saludos
const GreetingsTab: React.FC<{
  messages: CustomGreetingData[];
  emptyMessagesTemplate: CustomGreetingData[];
  newMessage: NewGreetingData;
  handleUpdate: (index: number) => void;
  handleDelete: (index: number) => void;
  handleNew: () => void;
}> = ({ messages, emptyMessagesTemplate, newMessage, handleUpdate, handleDelete, handleNew }) => (
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
{/*         <StyledDefaultButton onClick={handleNew}>
          Crear
        </StyledDefaultButton> */}
      </Box>
    </Box>
  </Box>
);

// Definir la interfaz para las acciones
interface TabAction {
  label: string;
  onClick: () => void;
  show?: boolean;
}

export const WidgetCustomizer: React.FC = () => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const { replacePath, appNavigation } = useAppContext();
  const [widgetData, setWidgetData] = useState<WidgetData>({ id: "" });
  const { getWidget, patchWidget, getCustomMessages } = useWidget();
  const { botId } = useParams();
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
    let data: Partial<WidgetData> = {
      id: widgetData.id,
    };
    Object.entries(widgetData).forEach(([key, value]) => {
      if (value !== values[key as keyof WidgetData]) {
        data[key as keyof WidgetData] = values[key as keyof WidgetData];
      }
    });
    
    patchWidget(widgetData.id, data)
      .then(() => SuccessToast("Widget actualizado correctamente"))
      .catch((error: { status: string; error: string }) => 
        ErrorToast(`Error: ${error.status} - ${error.error}`)
      );
  };

  const { handleSubmit, handleChange, errors, values, setValues } = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
  });

  const getWidgetData = useCallback((botId: string): void => {
    getWidget(botId)
      .then((response: ApiResponse<WidgetData>) => {
        const defaultedResponse = {
          ...response.data,
          primary_color: response.data.primary_color || theme.palette.primary.main,
          primary_textContrast: response.data.primary_textContrast || theme.palette.primary.contrastText,
          secondary_color: response.data.secondary_color || theme.palette.secondary.main,
          secondary_textContrast: response.data.secondary_textContrast || theme.palette.secondary.contrastText,
          badge_color: response.data.badge_color || theme.palette.primary.light,
          badge_contrast: response.data.badge_contrast || theme.palette.primary.contrastText,
        };
        
        setWidgetData(defaultedResponse);
        setValues(prevValues => ({
          ...prevValues,
          ...defaultedResponse
        }));
        setIsLoaded(true);
      })
      .catch(() => {
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
        setValues(prevValues => ({
          ...prevValues,
          ...fallbackData
        }));
        setIsLoaded(true);
      });
  }, [theme.palette, getWidget]);

  const getCustomMessagesData = useCallback((botId: string): Promise<void> => {
    return getCustomMessages(botId)
      .then((response: ApiResponse<{ data: CustomGreetingData[] }>) => {
        emptyMessagesTemplate = [...response.data.data];
        setMessages([...response.data.data]);
      })
      .catch((error: Error) => {
        console.log(error);
      });
  }, [getCustomMessages]);

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
      const newPath = {
        label: "Widget",
        current_path: `bots/widgetCustomizer/${botId}`,
        preview_path: "",
        translationKey: "widget"
      };

      replacePath([
        ...appNavigation.slice(0, 2),
        newPath,
      ]);
      
      getWidgetData(botId);
      getCustomMessagesData(botId).then(() => {
        setNewMessage(prev => ({ ...prev, bot: botId }));
      });
    }
  }, [botId]);

  // Agregar esta referencia al inicio del componente, junto con los otros estados
  const colorUpdateTimeout = useRef<ReturnType<typeof setTimeout>>();

  // Modificar el handleColorChange para mantener solo el último timer
  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Limpiar cualquier timer pendiente
    if (colorUpdateTimeout.current) {
      clearTimeout(colorUpdateTimeout.current);
    }
    
    // Actualizar el estado del formulik inmediatamente para la vista previa
    handleChange(e);
    
    // Crear el nuevo timer y guardarlo como el último
    colorUpdateTimeout.current = setTimeout(() => {
      setWidgetData(prevData => ({
        ...prevData,
        [name]: value
      }));
      // Limpiar la referencia del timer después de ejecutarse
      colorUpdateTimeout.current = undefined;
    }, 1);
  };

  // Función para asegurar que widgetData tenga todos los campos requeridos
  const getWidgetDataForPreview = () => ({
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
    faq_questions: widgetData.faq_questions
  });

  // Crear un manejador específico para ImageInput
  const handleImageChange = (event: ImageInputEvent) => {
    handleChange(event);
  };

  // Funciones específicas para cada tab
  const handleSaveColors = () => {
    const colorFields = [
      'primary_color',
      'primary_textContrast',
      'secondary_color',
      'secondary_textContrast',
      'badge_color',
      'badge_contrast'
    ];

    let data: Partial<WidgetData> = {
      id: widgetData.id,
    };

    colorFields.forEach(field => {
      if (widgetData[field as keyof WidgetData] !== values[field as keyof WidgetData]) {
        data[field as keyof WidgetData] = values[field as keyof WidgetData];
      }
    });

    if (Object.keys(data).length > 1) {
      patchWidget(widgetData.id, data)
        .then(() => SuccessToast("Colores actualizados correctamente"))
        .catch((error: { status: string; error: string }) => 
          ErrorToast(`Error: ${error.status} - ${error.error}`)
        );
    }
  };

  const handleSaveTypography = () => {
    const typographyFields = [
      'font_family',
      'faq_questions',
      'band_list'
    ];

    let data: Partial<WidgetData> = {
      id: widgetData.id,
    };

    typographyFields.forEach(field => {
      if (widgetData[field as keyof WidgetData] !== values[field as keyof WidgetData]) {
        data[field as keyof WidgetData] = values[field as keyof WidgetData];
      }
    });

    if (Object.keys(data).length > 1) {
      patchWidget(widgetData.id, data)
        .then(() => SuccessToast("Tipografía actualizada correctamente"))
        .catch((error: { status: string; error: string }) => 
          ErrorToast(`Error: ${error.status} - ${error.error}`)
        );
    }
  };

  const handleSaveImages = () => {
    const imageFields = [
      'brand_alt',
      'brand_logo',
      'icon_bot',
      'icon_chat',
      'icon_hidden',
      'icon_send'
    ];

    let data: Partial<WidgetData> = {
      id: widgetData.id,
    };

    imageFields.forEach(field => {
      if (widgetData[field as keyof WidgetData] !== values[field as keyof WidgetData]) {
        data[field as keyof WidgetData] = values[field as keyof WidgetData];
      }
    });

    if (Object.keys(data).length > 1) {
      patchWidget(widgetData.id, data)
        .then(() => SuccessToast("Imágenes actualizadas correctamente"))
        .catch((error: { status: string; error: string }) => 
          ErrorToast(`Error: ${error.status} - ${error.error}`)
        );
    }
  };

  const handleSaveSecurity = () => {
    const securityFields = [
      'sql_injection_tester',
      'php_injection_tester',
      'strange_chars_tester'
    ];

    let data: Partial<WidgetData> = {
      id: widgetData.id,
    };

    securityFields.forEach(field => {
      if (widgetData[field as keyof WidgetData] !== values[field as keyof WidgetData]) {
        data[field as keyof WidgetData] = values[field as keyof WidgetData];
      }
    });

    if (Object.keys(data).length > 1) {
      patchWidget(widgetData.id, data)
        .then(() => SuccessToast("Configuración de seguridad actualizada correctamente"))
        .catch((error: { status: string; error: string }) => 
          ErrorToast(`Error: ${error.status} - ${error.error}`)
        );
    }
  };

  // Actualizar las acciones de las tabs con las nuevas funciones
  const tabActions: TabAction[][] = [
    // Acciones para la tab de Colores
    [{
      label: "Guardar Colores",
      onClick: () => {
        setHelperText();
        handleSaveColors();
      }
    }],
    // Acciones para la tab de Tipografía
    [{
      label: "Guardar Tipografía",
      onClick: () => {
        setHelperText();
        handleSaveTypography();
      }
    }],
    // Acciones para la tab de Imágenes
    [{
      label: "Guardar Imágenes",
      onClick: () => {
        setHelperText();
        handleSaveImages();
      }
    }],
    // Acciones para la tab de Seguridad
    [{
      label: "Guardar Configuración",
      onClick: () => {
        setHelperText();
        handleSaveSecurity();
      }
    }],
    // Acciones para la tab de Saludos
    [{
      label: "Guardar Saludos",
      onClick: handleNew
    }]
  ];

  return (
    <DashboardContainer>
      <DashboardHeader 
        title="Widget Customizer"
      />

      <DashboardContent>
        <Paper elevation={3} sx={{ 
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          flex: 1,
          minHeight: 0
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
            minHeight: 0,
            overflow: 'auto',
            ...commonStyles.scrollableContent
          }}>
            {/* Panel izquierdo - Widget Preview */}
            <Box sx={{ 
              width: '40%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'flex-start',
              pt: 2
            }}>
              <Box sx={{ 
                maxHeight: '600px',
                transform: 'scale(0.9)',
                transformOrigin: 'top center'
              }}>
                <ReactWidget widgetData={getWidgetDataForPreview()} />
              </Box>
            </Box>

            {/* Panel derecho - Opciones de configuración */}
            <Box sx={{ 
              width: '60%',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              minHeight: 0
            }}>
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
                <Box component="form" 
                  onSubmit={handleSubmit} 
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    minHeight: 0
                  }}
                >
                  <Box sx={{ 
                    flex: 1, 
                    overflow: 'auto',
                    ...commonStyles.scrollableContent,
                    pr: 2
                  }}>
                    <TabPanel value={tabValue} index={0}>
                      <ColorsTab 
                        values={values}
                        handleColorChange={handleColorChange}
                      />
                    </TabPanel>

                    <TabPanel value={tabValue} index={1}>
                      <TypographyTab 
                        values={values}
                        handleChange={handleChange}
                        inputError={inputError}
                      />
                    </TabPanel>

                    <TabPanel value={tabValue} index={2}>
                      <ImagesTab 
                        values={values}
                        handleChange={handleImageChange}
                        errors={errors}
                      />
                    </TabPanel>

                    <TabPanel value={tabValue} index={3}>
                      <SecurityTab 
                        values={values}
                        handleChange={handleChange}
                      />
                    </TabPanel>

                    <TabPanel value={tabValue} index={4}>
                      <GreetingsTab 
                        messages={messages}
                        emptyMessagesTemplate={emptyMessagesTemplate}
                        newMessage={newMessage}
                        handleUpdate={handleUpdate}
                        handleDelete={handleDelete}
                        handleNew={handleNew}
                      />
                    </TabPanel>
                  </Box>
                </Box>
              )}
            </Box>
          </Box>
        </Paper>
      </DashboardContent>

      {/* Footer con botón específico para cada tab */}
      <DashboardFooter>
        <Box sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'center',
          alignItems: 'center',
          gap: 2,
          width: '100%'
        }}>
          {tabActions[tabValue].map((action, index) => (
            action.show !== false && (
              <Button
                key={`action-${index}`}
                variant="contained"
                onClick={action.onClick}
                type="submit"
                sx={{
                  color: 'white',
                  maxWidth: '222px !important',
                  padding: '6px 16px',
                  '&:hover': {
                    color: 'white',
                  },
                }}
              >
                {action.label}
              </Button>
            )
          ))}
        </Box>
      </DashboardFooter>
    </DashboardContainer>
  );
};

export default WidgetCustomizer;

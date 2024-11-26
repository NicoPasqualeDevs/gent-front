import React, { useCallback, useEffect, useState, useRef, ChangeEvent, BaseSyntheticEvent } from "react";
import { useParams } from "react-router-dom";
import { Grid, Box, Tabs, Typography, Tab, Paper, Button, Theme } from "@mui/material";
import { useTheme } from '@mui/material/styles';
import { useFormik } from "formik";
import * as Yup from 'yup';

// Hooks
import useWidget from "@/hooks/apps/widget";
import { useAppContext } from "@/context";

// Components
import { ReactWidget } from './components/ReactWidget';
import { ColorInput } from "@/components/Inputs/ColorInput";
import { StyledDefaultButton, StyledDangerButton } from "@/components/styledComponents/Buttons";
import { ErrorToast, SuccessToast } from "@/components/Toast";
import { PageCircularProgress } from "@/components/CircularProgress";
import { MultilineInput, TextInput, CheckboxInput } from "@/components/Inputs";
import { ShortInput } from "@/components/Inputs/ShortInput";
import { FormFileInput } from "@/utils/FormsViewUtils";
import DataEntry from "@/pages/Builder/WidgetCustomizer/components/DataEntry";
import PromptTemplate from './components/PromptTemplate';

// Utils & Types
import {
  DashboardContainer,
  DashboardHeader,
  DashboardContent,
  DashboardFooter,
  commonStyles
} from "@/utils/DashboardsUtils";

import {
  WidgetData,
  CustomGreetingData,
  NewGreetingData,
  TabAction,
  ColorInputEvent,
  ImageInputEvent,
  GreetingsTabProps
} from '@/types/WidgetProps';

import { ApiResponse } from "@/types/Api";

// Tipos locales
type FormChangeEvent = ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>;

interface FormikCustomErrors {
  [key: string]: string | undefined;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

interface BaseTabProps {
  values: Partial<WidgetData>;
  errors?: FormikCustomErrors;
  inputError?: Record<string, string>;
}

interface TypographyTabProps extends BaseTabProps {
  handleChange: (e: FormChangeEvent) => void;
}

interface ColorsTabProps extends BaseTabProps {
  handleColorChange: (e: ColorInputEvent) => void;
}

interface ImagesTabProps extends BaseTabProps {
  handleChange: (e: ImageInputEvent) => void;
}

interface SecurityTabProps extends BaseTabProps {
  handleChange: (e: FormChangeEvent) => void;
}

// Componente para la pestaña de Colores
const ColorsTab: React.FC<ColorsTabProps> = ({ values, handleColorChange}) => (
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

// Actualizar los componentes con los nuevos tipos
const TypographyTab: React.FC<TypographyTabProps> = ({ 
  values, 
  handleChange,
  errors = {}
}) => (
  <Grid container spacing={2}>
    <Grid item xs={12}>
      <TextInput
        name="font_family"
        label="Tipo de Fuente"
        placeholder="Ingrese el valor de atributo font-family deseado"
        helperText={errors.font_family || " "}
        value={values.font_family || ""}
        onChange={(e: BaseSyntheticEvent) => handleChange(e as FormChangeEvent)}
      />
    </Grid>
    <Grid item xs={12}>
      <MultilineInput
        name="faq_questions"
        label="Preguntas Frecuentes"
        placeholder="Ingrese las preguntas (separadas por |)"
        value={values.faq_questions ?? ""}
        helperText={errors.faq_questions ?? " "}
        onChange={(e: BaseSyntheticEvent) => handleChange(e as FormChangeEvent)}
      />
    </Grid>
    <Grid item xs={12}>
      <MultilineInput
        name="band_list"
        label="Palabras Baneadas"
        placeholder="Ingrese las palabras (separadas por |)"
        helperText={errors.band_list ?? " "}
        value={values.band_list ?? ""}
        onChange={(e: BaseSyntheticEvent) => handleChange(e as FormChangeEvent)}
      />
    </Grid>
  </Grid>
);

const ImagesTab: React.FC<ImagesTabProps> = ({ 
  values, 
  handleChange, 
  errors = {} 
}) => (
  <Grid container spacing={2}>
    <Grid item xs={12}>
      <TextInput
        name="brand_alt"
        label="Texto alternativo de Logo"
        placeholder="Ingrese el texto alternativo"
        helperText={errors.brand_alt || " "}
        value={values.brand_alt || ""}
        onChange={(e: BaseSyntheticEvent) => handleChange(e as FormChangeEvent)}
      />
    </Grid>
    <Grid item xs={12}>
      <FormFileInput
        name="brand_logo"
        label="Logo de Cliente"
        accept="image/*"
        onChange={(file) => {
          handleChange({
            target: {
              name: 'brand_logo',
              value: file || new File([], 'empty')
            }
          });
        }}
        error={errors.brand_logo}
      />
    </Grid>
    <Grid item xs={12}>
      <FormFileInput
        name="icon_bot"
        label="Ícono de bot"
        accept="image/*"
        onChange={(file) => {
          handleChange({
            target: {
              name: 'icon_bot',
              value: file || new File([], 'empty')
            }
          });
        }}
        error={errors.icon_bot}
      />
    </Grid>
    <Grid item xs={12}>
      <FormFileInput
        name="icon_chat"
        label="Ícono de chat"
        accept="image/*"
        onChange={(file) => {
          handleChange({
            target: {
              name: 'icon_chat',
              value: file || new File([], 'empty')
            }
          });
        }}
        error={errors.icon_chat}
      />
    </Grid>
    <Grid item xs={12}>
      <FormFileInput
        name="icon_hidden"
        label="Ícono de ocultar"
        accept="image/*"
        onChange={(file) => {
          handleChange({
            target: {
              name: 'icon_hidden',
              value: file || new File([], 'empty')
            }
          });
        }}
        error={errors.icon_hidden}
      />
    </Grid>
    <Grid item xs={12}>
      <FormFileInput
        name="icon_send"
        label="Ícono de enviar"
        accept="image/*"
        onChange={(file) => {
          handleChange({
            target: {
              name: 'icon_send',
              value: file || new File([], 'empty')
            }
          });
        }}
        error={errors.icon_send}
      />
    </Grid>
  </Grid>
);

const SecurityTab: React.FC<SecurityTabProps> = ({ 
  values, 
  handleChange 
}) => (
  <Grid container spacing={2}>
    <Grid item xs={12}>
      <CheckboxInput
        name="sql_injection_tester"
        label="Comprobación de Inyección de SQL"
        onChange={(e: BaseSyntheticEvent) => handleChange(e as FormChangeEvent)}
        value={values.sql_injection_tester}
      />
    </Grid>
    <Grid item xs={12}>
      <CheckboxInput
        name="php_injection_tester"
        label="Comprobación de Inyección de PHP"
        onChange={(e: BaseSyntheticEvent) => handleChange(e as FormChangeEvent)}
        value={values.php_injection_tester}
      />
    </Grid>
    <Grid item xs={12}>
      <CheckboxInput
        name="strange_chars_tester"
        label="Comprobación de uso de caracteres extraños"
        onChange={(e: BaseSyntheticEvent) => handleChange(e as FormChangeEvent)}
        value={values.strange_chars_tester}
      />
    </Grid>
  </Grid>
);

// Componente para la pestaña de Saludos
const GreetingsTab: React.FC<GreetingsTabProps> = ({
  messages,
  emptyMessagesTemplate,
  newMessage,
  handleUpdate,
  handleDelete,
  handleNew
}) => (
  <Grid container spacing={2}>
    <Grid item xs={12}>
      {messages.map((item: CustomGreetingData) => (
        <Box
          key={`greeting-${item.id || crypto.randomUUID()}`}
          sx={{
            display: 'flex',
            gap: 2,
            mb: 2,
            alignItems: 'center'
          }}
        >
          <ShortInput
            propKey="value"
            emptyData={emptyMessagesTemplate.find(template => template.id === item.id) || item}
            data={item}
          />
          <StyledDefaultButton
            onClick={() => handleUpdate(item.id || '')}
            sx={{ minWidth: '120px' }}
          >
            Actualizar
          </StyledDefaultButton>
          <StyledDangerButton
            onClick={() => handleDelete(item.id || '')}
            sx={{ minWidth: '120px' }}
          >
            Borrar
          </StyledDangerButton>
        </Box>
      ))}
    </Grid>

    <Grid item xs={12}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Crear nuevo mensaje
      </Typography>
      <Box sx={{
        display: 'flex',
        gap: 2,
        alignItems: 'center'
      }}>
        <ShortInput
          propKey="value"
          emptyData={newMessage}
          data={newMessage}

        />
        <StyledDefaultButton
          onClick={handleNew}
          sx={{ minWidth: '120px' }}
        >
          Crear
        </StyledDefaultButton>
      </Box>
    </Grid>
  </Grid>
);

// Definir los valores iniciales y el esquema de validación
const getInitialValues = (theme: Theme): WidgetData => ({
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
  icon_agent: "",
  sql_injection_tester: true,
  php_injection_tester: true,
  strange_chars_tester: true,
  band_list: "",
  faq_questions: ""
});

const validationSchema = Yup.object({
  primary_color: Yup.string(),
  primary_textContrast: Yup.string(),
  secondary_color: Yup.string(),
  secondary_textContrast: Yup.string(),
  badge_color: Yup.string(),
  badge_contrast: Yup.string(),
  font_family: Yup.string(),
  brand_alt: Yup.string(),
  brand_logo: Yup.mixed(),
  icon_bot: Yup.mixed(),
  icon_chat: Yup.mixed(),
  icon_hidden: Yup.mixed(),
  icon_send: Yup.mixed(),
  sql_injection_tester: Yup.boolean(),
  php_injection_tester: Yup.boolean(),
  strange_chars_tester: Yup.boolean(),
  band_list: Yup.string(),
  faq_questions: Yup.string()
});

// Actualizar el tipo de los datos para el patch
type PatchData = Partial<Omit<WidgetData, 'id'>> & { id: string };

// Componente TabPanel
function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`widget-tabpanel-${index}`}
      aria-labelledby={`widget-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

// Y agregar tipos para los parámetros response
interface WidgetResponse {
  data: WidgetData;
}


export const WidgetCustomizer: React.FC = () => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const { replacePath, appNavigation } = useAppContext();
  const [widgetData, setWidgetData] = useState<WidgetData>(() => ({
    ...getInitialValues(theme),
    id: ""
  }));
  const { getWidget, patchWidget, getCustomMessages } = useWidget();
  const { agentId } = useParams();
  const [messages, setMessages] = useState<CustomGreetingData[]>([]);
  const [newMessage, setNewMessage] = useState<NewGreetingData>({
    bot: "",
    text: "",
  });
  const [emptyMessagesTemplate, setEmptyMessagesTemplate] = useState<CustomGreetingData[]>([]);

  // Actualizar el tipo para incluir la nueva vista
  const [activeView, setActiveView] = useState<'customization' | 'knowledge' | 'prompt'>('customization');

  // Función para manejar el cambio de vista
  const handleViewChange = (view: 'customization' | 'knowledge' | 'prompt') => {
    setActiveView(view);
  };

  // Actualizar la configuración de formik
  const formik = useFormik({
    initialValues: getInitialValues(theme),
    validationSchema,
    onSubmit: async (values: WidgetData) => {
      await handleSubmit(values);
    }
  });

  // Actualizar getWidgetData
  const getWidgetData = useCallback((agentId: string): void => {
    getWidget(agentId)
      .then((response: WidgetResponse) => {
        const defaultedResponse: WidgetData = {
          ...getInitialValues(theme),
          ...response.data,
          primary_color: response.data.primary_color || theme.palette.primary.main,
          primary_textContrast: response.data.primary_textContrast || theme.palette.primary.contrastText,
          secondary_color: response.data.secondary_color || theme.palette.secondary.main,
          secondary_textContrast: response.data.secondary_textContrast || theme.palette.secondary.contrastText,
          badge_color: response.data.badge_color || theme.palette.primary.light,
          badge_contrast: response.data.badge_contrast || theme.palette.primary.contrastText,
        };

        setWidgetData(defaultedResponse);
        formik.setValues(defaultedResponse);
        setIsLoaded(true);
      })
      .catch(() => {
        const fallbackData: WidgetData = {
          ...getInitialValues(theme),
          id: "",
        };

        setWidgetData(fallbackData);
        formik.setValues(fallbackData);
        setIsLoaded(true);
      });
  }, [theme.palette, getWidget, formik.setValues]);

  const getCustomMessagesData = useCallback((agentId: string): Promise<void> => {
    return getCustomMessages(agentId)
      .then((response: ApiResponse<{ data: CustomGreetingData[] }>) => {
        const messagesData = Array.isArray(response.data.data) 
          ? response.data.data 
          : [];
        
        setEmptyMessagesTemplate([...messagesData]);
        setMessages([...messagesData]);
      })
      .catch((error: Error) => {
        console.error(error);
        setEmptyMessagesTemplate([]);
        setMessages([]);
      });
  }, [getCustomMessages]);

  const handleUpdate = (id: string) => {
    console.log(id);
    // Implementación...
  };

  const handleDelete = (id: string) => {
    console.log(id);
    // Implementación...
  };

  const handleNew = () => {
    // Implementación...
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Efectos y carga inicial
  useEffect(() => {
    if (agentId) {
      const newPath = {
        label: "Widget",
        current_path: `bots/widgetCustomizer/${agentId}`,
        preview_path: "",
        translationKey: "widget"
      };

      replacePath([
        ...appNavigation.slice(0, 2),
        newPath,
      ]);

      getWidgetData(agentId);
      getCustomMessagesData(agentId).then(() => {
        setNewMessage(prev => ({ ...prev, bot: agentId }));
      });
    }
  }, [agentId]);

  // Agregar esta referencia al inicio del componente, junto con los otros estados
  const colorUpdateTimeout = useRef<ReturnType<typeof setTimeout>>();

  // Actualizar el manejo de cambios de color
  const handleColorChange = (e: ColorInputEvent) => {
    const { name, value } = e.target;

    if (colorUpdateTimeout.current) {
      clearTimeout(colorUpdateTimeout.current);
    }

    colorUpdateTimeout.current = setTimeout(() => {
      formik.setFieldValue(name, value);
      setWidgetData(prev => ({
        ...prev,
        [name]: value
      }));
    }, 125);
  };

  // Actualizar el manejo de cambios de imagen
  const handleImageChange = (event: ImageInputEvent) => {
    const { name, value } = event.target;
    formik.setFieldValue(name, value);
    setWidgetData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Función para asegurar que widgetData tenga todos los campos requeridos
  const getWidgetDataForPreview = () => {
    const previewData = {
      primary_color: widgetData.primary_color || theme.palette.primary.main,
      primary_textContrast: widgetData.primary_textContrast || theme.palette.primary.contrastText,
      secondary_color: widgetData.secondary_color || theme.palette.secondary.main,
      secondary_textContrast: widgetData.secondary_textContrast || theme.palette.secondary.contrastText,
      badge_color: widgetData.badge_color || theme.palette.primary.light,
      badge_contrast: widgetData.badge_contrast || theme.palette.primary.contrastText,
      font_family: widgetData.font_family || '',
      brand_alt: widgetData.brand_alt || '',
      brand_logo: typeof widgetData.brand_logo === 'string' ? widgetData.brand_logo : '',
      icon_bot: typeof widgetData.icon_bot === 'string' ? widgetData.icon_bot : '',
      icon_chat: typeof widgetData.icon_chat === 'string' ? widgetData.icon_chat : '',
      icon_hidden: typeof widgetData.icon_hidden === 'string' ? widgetData.icon_hidden : '',
      icon_send: typeof widgetData.icon_send === 'string' ? widgetData.icon_send : '',
      faq_questions: widgetData.faq_questions,
      icon_agent: typeof widgetData.icon_agent === 'string' ? widgetData.icon_agent : '',
    };
    return previewData;
  };

  // Funciones específicas para cada tab
  const handleSaveColors = () => {
    if (!widgetData.id) return;

    const colorFields = [
      'primary_color',
      'primary_textContrast',
      'secondary_color',
      'secondary_textContrast',
      'badge_color',
      'badge_contrast'
    ] as const;

    const data: PatchData = {
      id: widgetData.id,
    };

    colorFields.forEach(field => {
      if (typeof formik.values[field] === 'string' && formik.values[field] !== widgetData[field]) {
        data[field] = formik.values[field] as string;
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
    if (!widgetData.id) return;

    const typographyFields = [
      'font_family',
      'faq_questions',
      'band_list'
    ] as const;

    const data: PatchData = {
      id: widgetData.id,
    };

    typographyFields.forEach(field => {
      const currentValue = formik.values[field];
      const widgetValue = widgetData[field];
      if (currentValue !== widgetValue) {
        data[field] = currentValue;
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
    if (!widgetData.id) return;

    const imageFields = [
      'brand_logo',
      'icon_bot',
      'icon_chat',
      'icon_hidden',
      'icon_send'
    ] as const;

    const data: PatchData = {
      id: widgetData.id,
    };

    let hasChanges = false;

    imageFields.forEach(field => {
      const currentValue = formik.values[field];
      const widgetValue = widgetData[field];
      
      if (currentValue instanceof File || 
         (typeof currentValue === 'string' && currentValue !== widgetValue)) {
        data[field] = currentValue;
        hasChanges = true;
      }
    });

    if (hasChanges) {
      patchWidget(widgetData.id, data)
        .then(() => SuccessToast("Imágenes actualizadas correctamente"))
        .catch((error: { status: string; error: string }) =>
          ErrorToast(`Error: ${error.status} - ${error.error}`)
        );
    }
  };

  const handleSaveSecurity = () => {
    if (!widgetData.id) return;

    const securityFields = [
      'sql_injection_tester',
      'php_injection_tester',
      'strange_chars_tester'
    ] as const;

    const data: PatchData = {
      id: widgetData.id,
    };

    securityFields.forEach(field => {
      const currentValue = formik.values[field];
      const widgetValue = widgetData[field];
      if (currentValue !== widgetValue) {
        data[field] = currentValue;
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
    [{
      label: "Guardar Colores",
      onClick: handleSaveColors
    }],
    // Acciones para la tab de Tipografía
    [{
      label: "Guardar Tipografía",
      onClick: handleSaveTypography
    }],
    // Acciones para la tab de Imágenes
    [{
      label: "Guardar Imágenes",
      onClick: handleSaveImages
    }],
    // Acciones para la tab de Seguridad
    [{
      label: "Guardar Configuración",
      onClick: handleSaveSecurity
    }],
    // Acciones para la tab de Saludos
    [{
      label: "Guardar Saludos",
      onClick: handleNew
    }],
    // Acciones para la tab de Datos
    [{
      label: "Guardar Datos",
      onClick: () => {
        // Aquí puedes agregar la lógica específica para guardar datos si es necesario
      }
    }]
  ];

  // Actualizar el handleSubmit para usar los valores de formik
  const handleSubmit = async (values: WidgetData) => {
    if (!widgetData.id) return;

    const data: Partial<WidgetData> & { id: string } = {
      id: widgetData.id
    };

    let hasChanges = false;

    // Tipado seguro para las keys
    (Object.keys(values) as Array<keyof WidgetData>).forEach(key => {
      if (key === 'id') return;
      
      const currentValue = values[key];
      const widgetValue = widgetData[key];

      // Manejar específicamente los campos que pueden ser File
      if (key === 'brand_logo' || 
          key === 'icon_bot' || 
          key === 'icon_chat' || 
          key === 'icon_hidden' || 
          key === 'icon_send') {
        if (currentValue instanceof File) {
          data[key] = currentValue;
          hasChanges = true;
        } else if (typeof currentValue === 'string' && currentValue !== widgetValue) {
          data[key] = currentValue;
          hasChanges = true;
        }
      }
      // Manejar campos booleanos
      else if (key === 'sql_injection_tester' || 
               key === 'php_injection_tester' || 
               key === 'strange_chars_tester') {
        if (typeof currentValue === 'boolean' && currentValue !== widgetValue) {
          data[key] = currentValue;
          hasChanges = true;
        }
      }
      // Manejar campos de texto
      else if (typeof currentValue === 'string' && currentValue !== widgetValue) {
        data[key] = currentValue;
        hasChanges = true;
      }
    });

    if (hasChanges) {
      patchWidget(widgetData.id, data)
        .then(() => SuccessToast("Widget actualizado correctamente"))
        .catch((error: { status: string; error: string }) =>
          ErrorToast(`Error: ${error.status} - ${error.error}`)
        );
    }
  };

  // Actualizar el tipo de evento para el formulario
  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    formik.handleSubmit(e);
  };

  return (
    <DashboardContainer>
      <DashboardHeader
        title="Widget Customizer"
        actions={
          <Box sx={{ 
            display: 'flex', 
            gap: 2,
            '& .MuiButton-root': {
              minWidth: '140px'
            }
          }}>
            <Button
              variant={activeView === 'customization' ? 'contained' : 'outlined'}
              onClick={() => handleViewChange('customization')}
              sx={{
                color: 'white',
                borderColor: activeView === 'customization' ? 'primary.main' : 'primary.light',
                backgroundColor: activeView === 'customization' ? 'primary.main' : 'transparent',
                '&:hover': {
                  color: 'white',
                  borderColor: activeView === 'customization' ? 'primary.main' : 'primary.light',
                  backgroundColor: activeView === 'customization' ? 'primary.main' : 'transparent'
                }
              }}
            >
              Personalización
            </Button>
            <Button
              variant={activeView === 'knowledge' ? 'contained' : 'outlined'}
              onClick={() => handleViewChange('knowledge')}
              sx={{
                color: 'white',
                borderColor: activeView === 'knowledge' ? 'primary.main' : 'primary.light',
                backgroundColor: activeView === 'knowledge' ? 'primary.main' : 'transparent',
                '&:hover': {
                  color: 'white',
                  borderColor: activeView === 'knowledge' ? 'primary.main' : 'primary.light',
                  backgroundColor: activeView === 'knowledge' ? 'primary.main' : 'transparent'
                }
              }}
            >
              Conocimiento
            </Button>
            <Button
              variant={activeView === 'prompt' ? 'contained' : 'outlined'}
              onClick={() => handleViewChange('prompt')}
              sx={{
                color: 'white',
                borderColor: activeView === 'prompt' ? 'primary.main' : 'primary.light',
                backgroundColor: activeView === 'prompt' ? 'primary.main' : 'transparent',
                '&:hover': {
                  color: 'white',
                  borderColor: activeView === 'prompt' ? 'primary.main' : 'primary.light',
                  backgroundColor: activeView === 'prompt' ? 'primary.main' : 'transparent'
                }
              }}
            >
              Instrucciones
            </Button>
          </Box>
        }
      />

      <DashboardContent>
        {activeView === 'customization' ? (
          <Paper elevation={3} sx={{
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            flex: 1,
            minHeight: 0
          }}>
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
                  <Box 
                    component="form"
                    onSubmit={handleFormSubmit}
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      minHeight: 0
                    }}
                  >
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                      <Tabs value={tabValue} onChange={handleTabChange}>
                        <Tab label="Colores" />
                        <Tab label="Tipografía" />
                        <Tab label="Imágenes" />
                        <Tab label="Seguridad" />
                        <Tab label="Saludos" />
                      </Tabs>
                    </Box>
                    <Box sx={{
                      flex: 1,
                      ...commonStyles.scrollableContent,
                      pr: 2
                    }}>
                      <TabPanel value={tabValue} index={0}>
                        <ColorsTab
                          values={formik.values}
                          handleColorChange={handleColorChange}
                          errors={formik.errors}
                        />
                      </TabPanel>

                      <TabPanel value={tabValue} index={1}>
                        <TypographyTab
                          values={formik.values}
                          handleChange={formik.handleChange}
                          errors={formik.errors}
                        />
                      </TabPanel>

                      <TabPanel value={tabValue} index={2}>
                        <ImagesTab
                          values={formik.values}
                          handleChange={handleImageChange}
                          errors={formik.errors}
                        />
                      </TabPanel>

                      <TabPanel value={tabValue} index={3}>
                        <SecurityTab
                          values={formik.values}
                          handleChange={formik.handleChange}
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
        ) : activeView === 'knowledge' ? (
          <Paper elevation={3} sx={{
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            flex: 1,
            minHeight: 0,
            p: 3
          }}>
            <DataEntry />
          </Paper>
        ) : (
          <Paper elevation={3} sx={{
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            flex: 1,
            minHeight: 0
          }}>
            <PromptTemplate />
          </Paper>
        )}
      </DashboardContent>

      {/* Footer solo visible en la vista de personalización */}
      {activeView === 'customization' && (
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
      )}
    </DashboardContainer>
  );
};

export default WidgetCustomizer;

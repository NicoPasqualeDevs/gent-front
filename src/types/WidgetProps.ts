import { File } from './Common';

// Tipos básicos
export type ChatRole = 'bot' | 'client';
export type WidgetTab = 'colors' | 'typography' | 'images' | 'security' | 'greetings' | 'data';

// Interfaces para los mensajes
export interface Message {
  role: ChatRole;
  content: string;
}

// Interfaces para los saludos personalizados
export interface CustomGreetingData {
  id: string;
  name: string;
  value: string;
  bot: string;
  text: string;
}

export interface NewGreetingData {
  id?: string;
  bot: string;
  text: string;
  name?: string;
  value?: string;
}

// Interfaces para las propiedades de los componentes
export interface ChatProps {
  primaryColor: string;
  primaryTextContrast: string;
  secondaryColor: string;
  secondaryTextContrast: string;
  iconBot: string;
}

export interface ChatActionProps {
  iconSend: string;
  primaryColor: string;
  secondaryColor: string;
}

export interface CoverProps {
  onStartChat: () => void;
  faqQuestions: string[];
  primaryColor: string;
}

export interface HeaderProps {
  chatState: boolean;
  brandLogo: string;
  brandAlt: string;
  onBack: () => void;
  primaryColor: string;
  primaryTextContrast: string;
}

export interface PopUpButtonProps {
  isOpen: boolean;
  onClick: () => void;
  iconChat: string;
  iconHidden: string;
  primaryColor: string;
  primaryTextContrast: string;
  secondaryColor: string;
  secondaryTextContrast: string;
  badgeColor: string;
  badgeContrast: string;
}

// Interfaces para los datos del Widget
export interface WidgetData {
  id: string;
  primary_color: string;
  primary_textContrast: string;
  secondary_color: string;
  secondary_textContrast: string;
  badge_color: string;
  badge_contrast: string;
  font_family: string;
  brand_alt: string;
  brand_logo: string | File;
  icon_bot: string | File;
  icon_chat: string | File;
  icon_hidden: string | File;
  icon_send: string | File;
  sql_injection_tester: boolean;
  php_injection_tester: boolean;
  strange_chars_tester: boolean;
  band_list: string;
  faq_questions: string;
}

// Tipos para eventos y acciones
export type ColorInputEvent = {
  target: {
    name: string;
    value: string;
  }
};

export type ImageInputEvent = {
  target: {
    name: string;
    value: File | string;
  }
};

export interface TabAction {
  label: string;
  onClick: () => void;
  show?: boolean;
}

// Interfaces para las props de los componentes de configuración
export interface ColorsTabProps {
  values: Partial<WidgetData>;
  handleColorChange: (e: ColorInputEvent) => void;
  errors?: Record<string, string>;
}

export interface TypographyTabProps {
  values: Partial<WidgetData>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  inputError: Record<string, string>;
}

export interface ImagesTabProps {
  values: Partial<WidgetData>;
  handleChange: (event: ImageInputEvent) => void;
  errors: Record<string, string>;
}

export interface SecurityTabProps {
  values: Partial<WidgetData>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export interface GreetingsTabProps {
  messages: CustomGreetingData[];
  emptyMessagesTemplate: CustomGreetingData[];
  newMessage: NewGreetingData;
  handleUpdate: (id: string) => void;
  handleDelete: (id: string) => void;
  handleNew: () => void;
}

// Interfaces para el preview del widget
export interface WidgetPreviewProps {
  widgetData: {
    primary_color: string;
    primary_textContrast: string;
    secondary_color: string;
    secondary_textContrast: string;
    badge_color: string;
    badge_contrast: string;
    font_family: string;
    brand_alt: string;
    brand_logo: string;
    icon_bot: string;
    icon_chat: string;
    icon_hidden: string;
    icon_send: string;
    faq_questions?: string;
  };
}

// Modificamos la interfaz PatchData para manejar correctamente los tipos
export interface PatchData extends Partial<Omit<WidgetData, 'id'>> {
  id: string;
  [key: string]: string | File | boolean | undefined;
}

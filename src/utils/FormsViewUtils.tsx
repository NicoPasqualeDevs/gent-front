import React from 'react';
import {
    Box,
    Paper,
    Typography,
    Container,
    Button,
    SxProps,
    Theme,
    TextField,
    FormControl,
    InputLabel,
    Select,
    Skeleton,
    FormHelperText
} from '@mui/material';
import { motion, AnimatePresence } from "framer-motion";
import { HeaderBaseProps, headerStyles } from './VerticalVarsUtils';
import { SelectChangeEvent } from '@mui/material/Select';

// Definir el tipo para los estilos base
type FormStylesType = {
    container: SxProps<Theme>;
    paper: SxProps<Theme>;
    form: SxProps<Theme>;
    inputGroup: SxProps<Theme>;
    actions: SxProps<Theme>;
    buttonBase: SxProps<Theme>;
    primaryButton: SxProps<Theme>;
    secondaryButton: SxProps<Theme>;
    cancelButton: SxProps<Theme>;
    fileInput: SxProps<Theme>;
    input: SxProps<Theme>;
    multilineInput: SxProps<Theme>;
    select: SxProps<Theme>;
};

// Actualizar los estilos base del botón
const buttonBaseStyles: SxProps<Theme> = {
    width: '200px',
    fontSize: '1.1rem',
    fontWeight: 500,
    textTransform: 'none',
    padding: '10px 24px',
    height: '48px',
    borderRadius: '8px',
};

// Definir estilos base para inputs
const inputBaseStyles: SxProps<Theme> = {
    width: '100%',
    '& .MuiInputBase-root': {
        borderRadius: '4px',
    },
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: 'rgba(255, 255, 255, 0.23)',
            borderWidth: '1px'
        },
        '&:hover fieldset': {
            borderColor: 'rgba(255, 255, 255, 0.87)',
            borderWidth: '1px'
        },
        '&.Mui-focused fieldset': {
            borderColor: 'primary.main',
            borderWidth: '1px'
        }
    }
};

// Estilos base
export const formStyles: FormStylesType = {
    container: {
        py: 2,
        px: { xs: 1, sm: 2, md: 3 },
        width: '100%',
        maxWidth: '100%'
    },
    paper: {
        p: { xs: 2, sm: 3 },
        mt: 2
    },
    form: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 3
    },
    inputGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        width: '100%',
        '&:first-of-type': {
            marginTop: 0
        },
        '&:not(:first-of-type)': {
            marginTop: 0
        }
    },
    actions: {
        display: 'flex',
        flexDirection: { xs: 'column', lg: 'row' },
        gap: { xs: 2, lg: 2 },
        justifyContent: { xs: 'stretch', lg: 'flex-end' },
        marginTop: 3,
        width: '100%'
    },
    buttonBase: {
        ...buttonBaseStyles,
        width: { xs: '100%', lg: '200px' },
    },
    primaryButton: {
        ...buttonBaseStyles,
        width: { xs: '100%', lg: '200px' },
        minWidth: { xs: '100%', lg: '120px' },
        backgroundColor: 'primary.main',
        color: '#FFFFFF',
        transition: 'background-color 300ms cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
            backgroundColor: 'primary.dark',
            color: '#FFFFFF'
        }
    },
    secondaryButton: {
        ...buttonBaseStyles,
        width: { xs: '100%', lg: '200px' },
        minWidth: { xs: '100%', lg: '120px' },
        color: '#FFFFFF',
        borderColor: 'primary.main',
        '&:hover': {
            borderColor: 'primary.dark',
            backgroundColor: 'rgba(255, 255, 255, 0.04)',
            color: '#FFFFFF'
        }
    },
    cancelButton: {
        ...buttonBaseStyles,
        width: { xs: '100%', lg: '200px' },
        minWidth: { xs: '100%', lg: '120px' },
        marginRight: { xs: 0, lg: '10px' },
        color: '#FFFFFF',
        borderColor: 'primary.main',
        transition: 'border-color 300ms cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
            borderColor: 'primary.dark',
            color: '#FFFFFF',
            backgroundColor: 'rgba(255, 255, 255, 0.04)'
        }
    },
    fileInput: {
        padding: '14px',
        border: '1px dashed rgba(255, 255, 255, 0.23)',
        borderRadius: '4px',
        transition: 'border-color 300ms cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
            borderColor: 'rgba(255, 255, 255, 0.87)'
        }
    },
    input: {
        ...inputBaseStyles
    },
    multilineInput: {
        ...inputBaseStyles,
        '& .MuiInputBase-root': {
            borderRadius: '4px',
            padding: '14px'
        }
    },
    select: {
        ...inputBaseStyles
    }
} as const;

// Componentes reutilizables
export const FormLayout: React.FC<{
    children: React.ReactNode;
}> = ({ children }) => (
    <Container maxWidth="xl" sx={formStyles.container}>
        {children}
    </Container>
);

export const FormHeader: React.FC<HeaderBaseProps> = ({
    title,
    actions,
    sx
}) => (
    <Paper
        elevation={3}
        sx={{
            ...headerStyles.container,
            p: { xs: 2, sm: 3 },
            '& .MuiTypography-h5': {
                fontSize: {
                    xs: '1.2rem',
                    sm: '1.4rem',
                    md: '1.5rem',
                    lg: '1.7rem'
                },
                lineHeight: {
                    xs: 1.3,
                    sm: 1.4,
                    md: 1.5
                },
                wordBreak: 'break-word'
            },
            ...sx
        }}
    >
        <Box sx={{
            ...headerStyles.wrapper,
            flexDirection: { xs: 'column', sm: 'row' },
            gap: { xs: 1, sm: 2 }
        }}>
            <Typography variant="h5" sx={headerStyles.title}>
                {title}
            </Typography>
            {actions && (
                <Box sx={{
                    ...headerStyles.actionsContainer,
                    mt: { xs: 1, sm: 0 }
                }}>
                    {actions}
                </Box>
            )}
        </Box>
    </Paper>
);

// Definimos una interfaz para la configuración del skeleton
interface SkeletonConfig {
  type: 'text' | 'textarea' | 'select' | 'file';
  height?: number;
}

// Componente para el skeleton del formulario
export const FormSkeleton: React.FC<{
  fields?: SkeletonConfig[];
  showActions?: boolean;
}> = ({ 
  fields = [
    { type: 'text', height: 56 },
  ], 
  showActions = true 
}) => (
    <Box sx={{
        ...formStyles.form,
        '& > *:not(:last-child)': {
            mb: 0
        }
    }}>
        {fields.map((field, index) => (
            <FormInputGroup key={index}>
                <Skeleton 
                    variant="rectangular" 
                    height={field.type === 'textarea' ? 128 : field.height || 56}
                    sx={{ 
                        borderRadius: '4px',
                        bgcolor: 'rgba(255, 255, 255, 0.05)',
                        width: '100%'
                    }} 
                />
            </FormInputGroup>
        ))}

        {showActions && (
            <Box sx={{
                ...formStyles.actions,
                mt: 3
            }}>
                <Skeleton 
                    variant="rectangular" 
                    height={48}
                    sx={{ 
                        borderRadius: '8px',
                        bgcolor: 'rgba(255, 255, 255, 0.05)',
                        width: { xs: '100%', lg: '200px' }
                    }} 
                />
                <Skeleton 
                    variant="rectangular" 
                    height={48}
                    sx={{ 
                        borderRadius: '8px',
                        bgcolor: 'rgba(255, 255, 255, 0.05)',
                        width: { xs: '100%', lg: '200px' }
                    }} 
                />
            </Box>
        )}
    </Box>
);

// Actualizar FormContent para incluir la animación
interface FormContentProps {
    children: React.ReactNode;
    onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
    encType?: string;
    isLoading?: boolean;
    isSubmitting?: boolean;
    skeletonFields?: SkeletonConfig[];
}

export const FormContent: React.FC<FormContentProps> = ({ 
    children, 
    onSubmit, 
    encType, 
    isLoading, 
    isSubmitting,
    skeletonFields 
}) => (
    <Paper elevation={3} sx={formStyles.paper}>
        <AnimatePresence mode="wait">
            <Box
                component="form"
                onSubmit={onSubmit}
                sx={formStyles.form}
                encType={encType}
            >
                {isLoading || isSubmitting ? (
                    <FormSkeleton fields={skeletonFields} />
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        style={{ 
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '24px'
                        }}
                    >
                        {children}
                    </motion.div>
                )}
            </Box>
        </AnimatePresence>
    </Paper>
);

export const FormInputGroup: React.FC<{
    children: React.ReactNode;
}> = ({ children }) => (
    <Box sx={formStyles.inputGroup}>
        {children}
    </Box>
);

export const FormActions: React.FC<{
    children: React.ReactNode;
}> = ({ children }) => (
    <Box sx={formStyles.actions}>
        {children}
    </Box>
);

export const FormButton: React.FC<{
    children: React.ReactNode;
    type?: "submit" | "button";
    variant?: "contained" | "outlined";
    onClick?: () => void;
    disabled?: boolean;
    loading?: boolean;
    animate?: boolean;
}> = ({ children, type = "button", variant = "contained", onClick, disabled, loading, animate }) => {
    const ButtonComponent = animate ? motion.div : React.Fragment;
    const animateProps = animate ? {
        whileHover: { scale: 1.02, transition: { duration: 0.2 } },
        whileTap: { scale: 0.98 }
    } : {};

    return (
        <ButtonComponent {...animateProps}>
            <Button
                type={type}
                variant={variant}
                onClick={onClick}
                disabled={disabled || loading}
                sx={variant === "contained" ? formStyles.primaryButton : formStyles.secondaryButton}
            >
                {loading ? "Cargando..." : children}
            </Button>
        </ButtonComponent>
    );
};

// Actualizar la interfaz del FormFileInput
interface FormFileInputProps {
  name?: string;
  label: string;
  accept?: string;
  onChange: (file: File) => void;
  error?: string;
}

export const FormFileInput: React.FC<FormFileInputProps> = ({ accept, onChange, error }) => (
    <Box sx={formStyles.fileInput}>
        <input
            type="file"
            accept={accept}
            onChange={(e) => {
                const file = e.currentTarget.files?.[0];
                if (file) onChange(file);
            }}
        />
        {error && <Typography color="error">{error}</Typography>}
    </Box>
);

export const FormCancelButton: React.FC<{
    onClick: () => void;
    disabled?: boolean;
    loading?: boolean;
    children: React.ReactNode;
}> = ({ onClick, disabled, loading, children }) => (
    <Button
        variant="outlined"
        onClick={onClick}
        disabled={disabled || loading}
        sx={formStyles.cancelButton}
    >
        {loading ? "Cargando..." : children}
    </Button>
);

export const FormTextField: React.FC<{
    name: string;
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: boolean;
    helperText?: string;
    required?: boolean;
    multiline?: boolean;
    disabled?: boolean;
    rows?: number;
    type?: string;
}> = ({ multiline, rows, ...props }) => (
    <TextField
        {...props}
        multiline={multiline}
        rows={rows}
        sx={multiline ? formStyles.multilineInput : formStyles.input}
        fullWidth
    />
);

interface FormSelectProps {
  name: string;
  label: string;
  value: string;
  onChange: (e: SelectChangeEvent<string>) => void;
  children: React.ReactNode;
  labelId?: string;
  error?: boolean;
  helperText?: string;
  disabled?: boolean;
  fullWidth?: boolean;
}

export const FormSelect: React.FC<FormSelectProps> = ({
  name,
  label,
  value,
  onChange,
  children,
  labelId,
  error,
  helperText,
  disabled,
  fullWidth = true
}) => (
  <FormControl 
    sx={formStyles.select} 
    error={error}
    fullWidth={fullWidth}
    disabled={disabled}
  >
    <InputLabel id={labelId || `${name}-label`}>{label}</InputLabel>
    <Select
      labelId={labelId || `${name}-label`}
      id={name}
      name={name}
      value={value}
      label={label}
      onChange={onChange}
    >
      {children}
    </Select>
    {helperText && (
      <FormHelperText>{helperText}</FormHelperText>
    )}
  </FormControl>
);

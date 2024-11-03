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
    Skeleton
} from '@mui/material';
import { motion } from "framer-motion";
import { HeaderBaseProps, headerStyles } from './VerticalVarsUtils';

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
        px: { xs: 1, sm: 2, md: 3 }
    },
    paper: {
        p: 3,
        mt: 2
    },
    form: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 2
    },
    inputGroup: {
        marginTop: '12px'
    },
    actions: {
        display: 'flex',
        gap: 2,
        justifyContent: 'flex-end',
        marginTop: '24px'
    },
    buttonBase: buttonBaseStyles,
    primaryButton: {
        ...buttonBaseStyles,
        minWidth: '120px',
        backgroundColor: 'primary.main',
        color: '#FFFFFF',
        transition: 'background-color 300ms cubic-bezier(0.4, 0, 0.2, 1), color 300ms cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
            backgroundColor: 'primary.dark',
            color: '#000000'
        }
    },
    secondaryButton: {
        ...buttonBaseStyles,
        minWidth: '120px',
        color: 'primary.main',
        borderColor: 'primary.main',
        '&:hover': {
            borderColor: 'primary.dark',
            backgroundColor: 'rgba(0, 0, 0, 0.04)'
        }
    },
    cancelButton: {
        ...buttonBaseStyles,
        marginRight: '10px',
        minWidth: '120px',
        color: 'primary.main',
        borderColor: 'primary.main',
        transition: 'color 300ms cubic-bezier(0.4, 0, 0.2, 1), border-color 300ms cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
            borderColor: 'primary.dark',
            color: 'primary.dark'
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
            ...sx
        }}
    >
        <Box sx={headerStyles.wrapper}>
            <Typography variant="h5" sx={headerStyles.title}>
                {title}
            </Typography>
            {actions && (
                <Box sx={headerStyles.actionsContainer}>
                    {actions}
                </Box>
            )}
        </Box>
    </Paper>
);

// Componente para el skeleton del formulario
export const FormSkeleton: React.FC = () => (
    <Box sx={formStyles.form}>
        {[1, 2, 3].map((index) => (
            <FormInputGroup key={index}>
                <Skeleton 
                    variant="rectangular" 
                    height={56}  // Altura estándar de un TextField de MUI
                    sx={{ 
                        borderRadius: '4px',
                        bgcolor: 'rgba(255, 255, 255, 0.1)'  // Color más suave para el skeleton
                    }} 
                />
            </FormInputGroup>
        ))}
        <FormActions>
            <Skeleton 
                variant="rectangular" 
                width={120}
                height={48}
                sx={{ 
                    borderRadius: '8px',
                    bgcolor: 'rgba(255, 255, 255, 0.1)'
                }} 
            />
            <Skeleton 
                variant="rectangular" 
                width={120}
                height={48}
                sx={{ 
                    borderRadius: '8px',
                    bgcolor: 'rgba(255, 255, 255, 0.1)'
                }} 
            />
        </FormActions>
    </Box>
);

// Actualizar FormContent para incluir el skeleton
export const FormContent: React.FC<{
    children: React.ReactNode;
    onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
    encType?: string;
    isLoading?: boolean;  // Nueva prop
}> = ({ children, onSubmit, encType, isLoading }) => (
    <Paper elevation={3} sx={formStyles.paper}>
        <Box
            component="form"
            onSubmit={onSubmit}
            sx={formStyles.form}
            encType={encType}
        >
            {isLoading ? <FormSkeleton /> : children}
        </Box>
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

export const FormSelect: React.FC<{
    labelId: string;
    label: string;
    value: string;
    onChange: (e: any) => void;
    children: React.ReactNode;
    name: string;
}> = (props) => (
    <FormControl sx={formStyles.select}>
        <InputLabel id={props.labelId}>{props.label}</InputLabel>
        <Select {...props} />
    </FormControl>
);

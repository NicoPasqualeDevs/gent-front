import React from 'react';
import {
    Box,
    Paper,
    Typography
} from '@mui/material';
import { HeaderBaseProps, headerStyles } from './VerticalVarsUtils';

// Componente para el encabezado del formulario
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

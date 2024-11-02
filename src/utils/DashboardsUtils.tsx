import React from 'react';
import {
    Box,
    Paper,
    Typography,
    Container,
    Card,
    CardContent,
    Skeleton,
    Theme,
    useTheme,
    alpha
} from '@mui/material';
import { SxProps } from '@mui/system';

// Tipos comunes
interface DashboardContainerProps {
    children: React.ReactNode;
    maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    sx?: SxProps<Theme>;
}

interface DashboardHeaderProps {
    title: string;
    actions?: React.ReactNode;
    sx?: SxProps<Theme>;
}

interface DashboardContentProps {
    children: React.ReactNode;
    sx?: SxProps<Theme>;
}

interface DashboardFooterProps {
    children: React.ReactNode;
    sx?: SxProps<Theme>;
}

interface SkeletonCardProps {
    height?: number | string;
    variant?: 'agent' | 'team';
}

// Componente contenedor principal del dashboard
export const DashboardContainer: React.FC<DashboardContainerProps> = ({
    children,
    maxWidth = 'xl',
    sx
}) => (
    <Container
        maxWidth={maxWidth}
        sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            py: 2,
            px: { xs: 1, sm: 2, md: 3 },
            ...sx
        }}
    >
        {children}
    </Container>
);

// Componente para el encabezado del dashboard
export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
    title,
    actions,
    sx
}) => (
    <Paper
        elevation={3}
        sx={{
            p: 2,
            mb: 2,
            flexShrink: 0,
            ...sx
        }}
    >
        <Box sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
        }}>
            <Typography variant="h5">
                {title}
            </Typography>
            {actions && (
                <Box sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    alignItems: 'center',
                    gap: 2,
                    width: { xs: '100%', sm: 'auto' }
                }}>
                    {actions}
                </Box>
            )}
        </Box>
    </Paper>
);

// Componente para el contenido principal del dashboard
export const DashboardContent: React.FC<DashboardContentProps> = ({
    children,
    sx
}) => (
    <Box
        sx={{
            flexGrow: 1,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            ...sx
        }}
    >
        {children}
    </Box>
);

// Componente para el pie del dashboard
export const DashboardFooter: React.FC<DashboardFooterProps> = ({
    children,
    sx
}) => (
    <Paper
        elevation={3}
        sx={{
            p: 2,
            mt: 2,
            flexShrink: 0,
            ...sx
        }}
    >
        <Box sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
        }}>
            {children}
        </Box>
    </Paper>
);

// Componente de tarjeta con skeleton para estados de carga
export const SkeletonCard: React.FC<SkeletonCardProps> = ({ height = 180, variant = 'team' }) => {
    const theme = useTheme();

    if (variant === 'agent') {
        return (
            <Card sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: 'transparent',
                border: `1px solid ${theme.palette.divider}`,
                boxShadow: 'none',
            }}>
                <CardContent sx={{ p: 2 }}>
                    {/* Header con avatar y título */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
                        <Box sx={{ flex: 1 }}>
                            <Skeleton variant="text" width="60%" height={24} />
                            <Skeleton variant="text" width="40%" height={20} />
                        </Box>
                    </Box>

                    {/* Badge del modelo */}
                    <Skeleton
                        variant="rectangular"
                        width={200}
                        height={36}
                        sx={{
                            borderRadius: '16px',
                            mb: 2
                        }}
                    />

                    {/* Área de implementación */}
                    <Skeleton variant="text" width="40%" height={24} sx={{ mb: 1 }} />
                    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                        <Skeleton variant="rectangular" width={100} height={32} sx={{ borderRadius: 1 }} />
                        <Skeleton variant="rectangular" width={100} height={32} sx={{ borderRadius: 1 }} />
                        <Skeleton variant="rectangular" width={100} height={32} sx={{ borderRadius: 1 }} />
                    </Box>

                    {/* Área de configuración */}
                    <Skeleton variant="text" width="40%" height={24} sx={{ mb: 1 }} />
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Skeleton variant="text" width={60} height={24} />
                        <Skeleton variant="text" width={60} height={24} />
                        <Skeleton variant="text" width={60} height={24} />
                    </Box>
                </CardContent>
            </Card>
        );
    }

    // Variant team (default)
    return (
        <Card sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: 'transparent',
            border: `1px solid ${theme.palette.divider}`,
            boxShadow: 'none',
        }}>
            <CardContent sx={{ p: 2 }}>
                {/* Título y descripción */}
                <Skeleton variant="text" width="70%" height={28} sx={{ mb: 1 }} />
                <Skeleton variant="text" width="50%" height={20} sx={{ mb: 2 }} />

                {/* Área de contenido principal - reducida */}
                <Skeleton variant="rectangular" height={60} sx={{ mb: 2, borderRadius: 1 }} />
            </CardContent>

            {/* Footer con información del propietario */}
            <Box sx={{
                p: 2,
                pt: 1,
                mt: 'auto',
                borderTop: `1px solid ${theme.palette.divider}`,
                display: 'flex',
                alignItems: 'center'
            }}>
                <Skeleton variant="circular" width={20} height={20} sx={{ mr: 1 }} />
                <Skeleton variant="text" width="60%" height={20} />
            </Box>
        </Card>
    );
};

// Estilos comunes reutilizables
export const commonStyles = {
    card: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'transparent',
        border: (theme: Theme) => `1px solid ${theme.palette.divider}`,
        boxShadow: 'none',
        width: '100%',
    },
    cardContent: {
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        p: 3,
        '&:last-child': { pb: 3 },
    },
    searchContainer: {
        minWidth: '200px',
        width: '200px',
    },
    scrollableContent: {
        '&::-webkit-scrollbar': {
            width: '6px',
            height: '6px',
        },
        '&::-webkit-scrollbar-track': {
            background: 'transparent',
        },
        '&::-webkit-scrollbar-thumb': {
            background: (theme: Theme) => alpha(theme.palette.primary.main, 0.8),
            borderRadius: '3px',
        },
        '&::-webkit-scrollbar-thumb:hover': {
            background: (theme: Theme) => theme.palette.action.hover,
        },
    },
};

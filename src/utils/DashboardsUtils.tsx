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
import { HeaderBaseProps, headerStyles } from './VerticalVarsUtils';
import { 
    spacing, 
    dimensions, 
    typography, 
    borders, 
    alignment,
    common 
} from '@/components/AiTeamCard/SkeletonAiTeamCardsVars';

// Tipos comunes
interface DashboardContainerProps {
    children: React.ReactNode;
    maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    sx?: SxProps<Theme>;
}

interface DashboardHeaderProps extends HeaderBaseProps {}

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

    if (variant === 'team') {
        return (
            <Card sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: 'transparent',
                border: `1px solid ${theme.palette.divider}`,
                boxShadow: 'none',
            }}>
                <CardContent sx={{
                    p: spacing.cardPadding,
                    py: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    '&:last-child': { pb: spacing.cardPadding },
                }}>
                    {/* Contenido principal */}
                    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', mb: 0 }}>
                        {/* Título */}
                        <Skeleton 
                            variant="text" 
                            width={common.titleSkeletonWidth} 
                            height={dimensions.card.titleHeight} 
                            sx={{ mb: spacing.sectionMarginBottom }} 
                        />

                        {/* Dirección */}
                        <Box sx={{ 
                            ...alignment.text,
                            gap: spacing.contentGap, 
                            mb: spacing.sectionMarginBottom,
                            height: dimensions.card.addressHeight 
                        }}>
                            <Skeleton 
                                variant="circular" 
                                width={dimensions.card.iconSize.location} 
                                height={dimensions.card.iconSize.location} 
                            />
                            <Skeleton 
                                variant="text" 
                                width={common.addressSkeletonWidth} 
                                height={dimensions.card.addressHeight}
                                sx={{
                                    transform: alignment.skeletonTransform,
                                }}
                            />
                        </Box>

                        {/* LLM Key Badge */}
                        <Box sx={{ mb: 2 }}>
                            <Skeleton
                                variant="rectangular"
                                width={common.badgeSkeletonWidth}
                                height={dimensions.card.badgeHeight}
                                sx={{ borderRadius: borders.badgeRadius }}
                            />
                        </Box>

                        {/* Descripción */}
                        <Box sx={{ mb: 0 }}>
                            <Skeleton variant="text" width={common.descriptionSkeletonWidths.first} height={dimensions.lineHeight} />
                            <Skeleton variant="text" width={common.descriptionSkeletonWidths.second} height={dimensions.lineHeight} />
                            <Skeleton variant="text" width={common.descriptionSkeletonWidths.third} height={dimensions.lineHeight} />
                        </Box>
                    </Box>

                    {/* Footer */}
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        pt: spacing.contentGap,
                        borderTop: `1px solid ${theme.palette.divider}`,
                    }}>
                        {/* Owner info */}
                        <Box sx={{
                            ...alignment.text,
                            gap: spacing.contentGap,
                            minWidth: 0,
                        }}>
                            <Skeleton 
                                variant="circular" 
                                width={dimensions.card.iconSize.person} 
                                height={dimensions.card.iconSize.person} 
                            />
                            <Skeleton 
                                variant="text" 
                                width={common.ownerNameWidth} 
                                sx={{
                                    height: dimensions.card.addressHeight,
                                    transform: alignment.skeletonTransform,
                                }}
                            />
                        </Box>

                        {/* Action buttons */}
                        <Box sx={{
                            display: 'flex',
                            gap: spacing.footerButtonsGap,
                            alignItems: 'center',
                        }}>
                            {[...Array(3)].map((_, index) => (
                                <Skeleton
                                    key={index}
                                    variant="circular"
                                    width={dimensions.card.actionButtonSize}
                                    height={dimensions.card.actionButtonSize}
                                />
                            ))}
                        </Box>
                    </Box>
                </CardContent>
            </Card>
        );
    }

    // Variant team (default) - Actualizando para coincidir con el diseño real
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
        p: '24px',
        py: '8px',
        '&:last-child': { pb: '24px' },
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

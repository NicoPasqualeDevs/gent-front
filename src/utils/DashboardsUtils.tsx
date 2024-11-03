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
    alpha,
    Pagination,
    Button,
    Select,
    MenuItem
} from '@mui/material';
import { SxProps } from '@mui/system';
import { HeaderBaseProps, headerStyles } from './VerticalVarsUtils';
import AddIcon from '@mui/icons-material/Add';
import { SelectChangeEvent } from '@mui/material/Select';
// Tipos comunes
interface DashboardContainerProps {
    children: React.ReactNode;
    maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    sx?: SxProps<Theme>;
}

interface DashboardHeaderProps extends HeaderBaseProps { }

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
    variant?: 'agent' | 'team' | 'aiTeam';
}

// Añadir nueva interfaz para el PaginationFooter
interface PaginationFooterProps {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: string | number;
    onPageChange: (event: React.ChangeEvent<unknown>, value: number) => void;
    onItemsPerPageChange: (event: SelectChangeEvent) => void;
    createButton?: {
        onClick: () => void;
        label: string;
        show: boolean;
    };
    translations: {
        itemsCount: string;
        perPage: string;
    };
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
                <CardContent sx={{
                    py: 1,
                    position: 'relative',
                    height: '100%',
                    px: 3,
                    pb: '11px !important'
                }}>
                    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                        {/* Header con avatar y título */}
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            mb: 2,
                            height: 46.58,
                        }}>
                            <Skeleton
                                variant="circular"
                                width={40}
                                height={40}
                                sx={{
                                    mr: 1,
                                    alignSelf: 'center'
                                }}
                            />
                            <Box sx={{
                                flex: 1,
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                height: '100%'
                            }}>
                                <Skeleton
                                    variant="text"
                                    width={120}
                                    height={20}
                                    sx={{ mb: 0.25 }}
                                />
                                <Skeleton
                                    variant="text"
                                    width={150}
                                    height={16}
                                />
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

                        {/* Divider */}
                        <Skeleton
                            variant="rectangular"
                            width="100%"
                            height={1}
                            sx={{ mb: 2 }}
                        />

                        {/* Sección de implementación */}
                        <Box sx={{ mb: 2 }}>
                            <Skeleton
                                variant="text"
                                width={120}
                                height={25.11}
                                sx={{
                                    mb: 1.5,
                                    borderRadius: 2.5
                                }}
                            />
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <Skeleton
                                    variant="rectangular"
                                    width={100}
                                    height={22}
                                    sx={{ borderRadius: 2.5 }}
                                />
                                <Skeleton
                                    variant="rectangular"
                                    width={100}
                                    height={22}
                                    sx={{ borderRadius: 2.5 }}
                                />
                                <Skeleton
                                    variant="rectangular"
                                    width={100}
                                    height={22}
                                    sx={{ borderRadius: 2.5 }}
                                />
                            </Box>
                        </Box>

                        {/* Divider */}
                        <Skeleton
                            variant="rectangular"
                            width="100%"
                            height={1}
                            sx={{ mb: 2 }}
                        />

                        {/* Sección de configuración */}
                        <Box sx={{ mb: 0 }}>
                            <Skeleton
                                variant="text"
                                width={120}
                                height={25.11}
                                sx={{
                                    mb: 1.5,
                                    borderRadius: 2.5
                                }}
                            />
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <Skeleton
                                    variant="text"
                                    width={140}
                                    height={25.2}
                                    sx={{ borderRadius: 2.5 }}
                                />
                                <Skeleton
                                    variant="text"
                                    width={140}
                                    height={25.2}
                                    sx={{ borderRadius: 2.5 }}
                                />
                            </Box>
                        </Box>

                        {/* Botones flotantes */}
                        <Box sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            display: 'flex',
                            gap: 0.5
                        }}>
                            <Skeleton
                                variant="circular"
                                width={28}
                                height={28}
                                sx={{
                                    backgroundColor: alpha(theme.palette.background.paper, 0.2)
                                }}
                            />
                            <Skeleton
                                variant="circular"
                                width={28}
                                height={28}
                                sx={{
                                    backgroundColor: alpha(theme.palette.background.paper, 0.2)
                                }}
                            />
                        </Box>
                    </Box>
                </CardContent>
            </Card>
        );
    }

    if (variant === 'aiTeam') {
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
                    display: 'flex',
                    flexDirection: 'column',
                    p: '24px',
                    pt: '12px',
                    pb: '12px !important',
                    height: '100%',
                    position: 'relative'
                }}>
                    {/* Header - Title */}
                    <Box sx={{ mb: 1 }}>
                        <Skeleton
                            variant="text"
                            width="70%"
                            height={32}
                        />
                    </Box>

                    {/* Address */}
                    <Box sx={{ mb: 2 }}>
                        <Skeleton
                            variant="text"
                            width="40%"
                            height={20}
                        />
                    </Box>

                    {/* LLM Tag */}
                    <Box sx={{ mb: 2 }}>
                        <Skeleton
                            variant="rectangular"
                            width={100}
                            height={24}
                            sx={{
                                borderRadius: 1,
                                backgroundColor: alpha(theme.palette.primary.main, 0.1)
                            }}
                        />
                    </Box>

                    {/* Description */}
                    <Box sx={{ mb: 2 }}>
                        <Skeleton
                            variant="text"
                            width="100%"
                            height={20}
                            sx={{ mb: 0.5 }}
                        />
                        <Skeleton
                            variant="text"
                            width="90%"
                            height={20}
                            sx={{ mb: 0.5 }}
                        />
                        <Skeleton
                            variant="text"
                            width="80%"
                            height={20}
                        />
                    </Box>

                    {/* Divider */}
                    <Skeleton
                        variant="rectangular"
                        width="100%"
                        height={1}
                        sx={{ mb: 2 }}
                    />

                    {/* Footer with owner and action buttons */}
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mt: '-8px'
                    }}>
                        {/* Owner section */}
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            mb: '-26px'
                        }}>
                            <Skeleton
                                variant="circular"
                                width={24}
                                height={24}
                            />
                            <Skeleton
                                variant="text"
                                width={80}
                                height={20}
                            />
                        </Box>

                        {/* Action buttons */}
                        <Box sx={{
                            display: 'flex',
                            gap: 1,
                            mb: '-8px'
                        }}>
                            {[1, 2, 3].map((_, index) => (
                                <Skeleton
                                    key={index}
                                    variant="circular"
                                    sx={{
                                        mt: '4px',
                                        mr: '6px'
                                    }}
                                    width={24}
                                    height={24}
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
            <CardContent sx={{ pb: 2 }}>
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
        pt: '12px',
        '&:last-child': { pb: '12px' },
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

// Nuevo componente PaginationFooter
export const PaginationFooter: React.FC<PaginationFooterProps> = ({
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    onPageChange,
    createButton,
    translations
}) => {
    const endItem = Math.min(currentPage * Number(itemsPerPage), totalItems);

    return (
        <DashboardFooter>
            <Box sx={{
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 2,
                width: '100%'
            }}>
                {/* Paginación y selector de items por página */}
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    flexDirection: { xs: 'column', sm: 'row' }
                }}>
                    <Pagination
                        count={totalPages}
                        page={currentPage}
                        onChange={onPageChange}
                        color="primary"
                        size="small"
                        sx={{
                            '& .MuiPaginationItem-root': {
                                paddingTop: '2px',
                                color: 'white !important'
                            }
                        }}
                    />
                </Box>
                {/* Botón de acción en el centro (opcional) */}
                {createButton?.show && (
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Button
                            variant="contained"
                            onClick={createButton.onClick}
                            startIcon={<AddIcon />}
                            sx={{
                                color: 'white',
                                '&:hover': {
                                    color: 'white',
                                },
                            }}
                        >
                            {createButton.label}
                        </Button>
                    </Box>
                )}
                {/* Contador de páginas a la derecha */}
                <Box sx={{ textAlign: { xs: 'center', sm: 'right' }, display: 'flex', flexDirection: 'row', gap: 1 }}>
                    <Typography variant="body2" color="text.secondary" sx={{mr: -0.5}}>
                        {endItem.toString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {translations.itemsCount
                            .replace("{total}", totalItems.toString())}
                    </Typography>
                </Box>
            </Box>
        </DashboardFooter>
    );
};

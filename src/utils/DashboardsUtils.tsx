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
  useTheme
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
export const SkeletonCard: React.FC<SkeletonCardProps> = ({ height = 200 }) => {
  const theme = useTheme();
  
  return (
    <Card sx={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: 'transparent',
      border: `1px solid ${theme.palette.divider}`,
      boxShadow: 'none',
    }}>
      <CardContent>
        <Skeleton variant="rectangular" height={height} />
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
    p: 3,
    '&:last-child': { pb: 3 },
  },
  searchContainer: {
    minWidth: '200px',
    width: '200px',
  }
};

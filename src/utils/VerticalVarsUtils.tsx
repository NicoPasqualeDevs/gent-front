import { Theme } from '@mui/material';
import { SxProps } from '@mui/system';

// Tipos comunes para encabezados
export interface HeaderBaseProps {
    title: string;
    actions?: React.ReactNode;
    sx?: SxProps<Theme>;
}

// Estilos compartidos para encabezados
export const headerStyles = {
    container: {
        p: 2,
        mb: 2,
        flexShrink: 0,
        height: '64px',
        display: 'flex',
        alignItems: 'center'
    },
    wrapper: {
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
        width: '100%'
    },
    title: {
        fontSize: { xs: '2rem', sm: '1.5rem' }
    },
    actionsContainer: {
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: 'center',
        gap: 2,
        width: { xs: '100%', sm: 'auto' }
    }
} as const;

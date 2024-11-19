import { styled } from "@mui/material";
import "@/assets/fonts/ROBO.css"
import { useFontLoader } from "@/hooks/useFontLoader";

const StyledGlowingText = styled('h1')(({ theme }) => ({
    color: '#fff',
    fontSize: '4.5rem',
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: '8px',
    textTransform: 'none',
    marginBottom: '180px',
    lineHeight: 1.2,
    fontFamily: "ROBO",
    animation: 'glow 1.5s ease-in-out infinite alternate',
    '@keyframes glow': {
        from: {
            textShadow: `0 0 0px #fff,
            0 0 10px #fff,
            0 0 15px ${theme.palette.primary.main},
            0 0 20px ${theme.palette.primary.main}`
        },
        to: {
            textShadow: `0 0 1px #fff,
            0 0 15px #fff,
            0 0 25px ${theme.palette.primary.main},
            0 0 35px ${theme.palette.primary.main}`
        }
    },
    [theme.breakpoints.down('sm')]: {
        fontSize: '3.5rem',
    },
    [theme.breakpoints.down('xs')]: {
        fontSize: '3rem',
    }
}));

const GlowingText: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const fontLoaded = useFontLoader('ROBO');

    if (!fontLoaded) {
        return <div style={{ height: '4.5rem' }} />; // Placeholder mientras carga
    }

    return <StyledGlowingText>{children}</StyledGlowingText>;
};

export default GlowingText; 
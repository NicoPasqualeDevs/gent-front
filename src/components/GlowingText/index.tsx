import { styled } from "@mui/material";
import { useEffect, useState } from "react";

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

const GlowingText = ({ children }: { children: React.ReactNode }) => {
    const [fontLoaded, setFontLoaded] = useState(false);

    useEffect(() => {
        // Creamos una nueva instancia de FontFace
        const font = new FontFace('ROBO', 'url(/fonts/ROBO.ttf)');
        
        // Esperamos a que la fuente se cargue
        font.load().then(() => {
            // Añadimos la fuente al registro de fuentes del documento
            document.fonts.add(font);
            setFontLoaded(true);
        }).catch((err) => {
            console.error('Error cargando la fuente ROBO:', err);
            // Si hay error, mostramos el texto de todas formas
            setFontLoaded(true);
        });
    }, []);

    // Mientras la fuente se está cargando, podemos mostrar un espacio vacío o un loading
    if (!fontLoaded) {
        return <div style={{ height: '4.5rem' }} />;
    }

    return <StyledGlowingText>{children}</StyledGlowingText>;
};

export default GlowingText; 
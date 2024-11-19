import { styled, Skeleton } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { useAppContext } from "@/context";
import { memo } from "react";

const StyledGlowingText = styled(motion.h1)(({ theme }) => ({
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

const GlowingText: React.FC<{ children: React.ReactNode }> = memo(({ children }) => {
    const { fontLoaded } = useAppContext();

    return (
        <AnimatePresence mode="wait">
            {fontLoaded ? (
                <StyledGlowingText
                    key="glowing-text"
                    transition={{ duration: 0.5 }}
                >
                    {children}
                </StyledGlowingText>
            ) : (
                <Skeleton 
                    key="skeleton"
                    sx={{
                        bgcolor: 'rgba(255, 255, 255, 0.1)',
                        color: '#fff',
                        fontSize: '4.5rem',
                        fontWeight: 'bold',
                        textAlign: 'center',
                        letterSpacing: '8px',
                        textTransform: 'none',
                        marginBottom: '180px',
                        lineHeight: 1.2,
                        fontFamily: "ROBO",
                    }} 
                    variant="text" 
                    width="100%" 
                    height={100} 
                />
            )}
        </AnimatePresence>
    );
});

GlowingText.displayName = 'GlowingText';

export default GlowingText; 
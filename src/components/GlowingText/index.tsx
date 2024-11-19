import { styled, Skeleton } from "@mui/material";
import { motion } from "framer-motion";
import { useAppContext } from "@/context";

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

const GlowingText: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { fontLoaded } = useAppContext();
    return (
        <>
            {fontLoaded && (
                <StyledGlowingText
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 1 }}
                    style={{ opacity: 1 }}
                >
                    {children}
                </StyledGlowingText>
            )}
            {!fontLoaded && (
                <Skeleton variant="text" width="100%" height="100%" />
            )}
        </>
    );
};

export default GlowingText; 
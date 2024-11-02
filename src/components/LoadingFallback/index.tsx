import { Backdrop, BoxProps, LinearProgress, styled } from "@mui/material";
import React from "react";
import Box from "@mui/material/Box";

const ImageContainer = styled(Box)<BoxProps>(() => ({
    "&.MuiBox-root": {
        background: "transparent",
        color: "#fff",
        borderRadius: "10px",
        marginBottom: "-16px",
        marginTop: "-32px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
    },
}));


const GlowingText = styled('h1')(({ theme }) => ({
    color: '#fff',
    fontSize: '4rem',
    fontWeight: 'bold',
    textAlign: 'center',
    textTransform: 'uppercase',
    animation: 'glow 1.25s ease-in-out infinite alternate',
    '@keyframes glow': {
        from: {
            textShadow: `0 0 5px #fff,
        0 0 10px #fff,
        0 0 15px ${theme.palette.primary.main},
        0 0 20px ${theme.palette.primary.main}`
        },
        to: {
            textShadow: `0 0 10px #fff,
        0 0 20px #fff,
        0 0 30px ${theme.palette.primary.main},
        0 0 40px ${theme.palette.primary.main}`
        }
    }
}));

const LoadingFallback: React.FC = () => {
    return (
        <Box sx={{ textAlign: "center", height: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
            <ImageContainer sx={{ mb: 2 }}>
                <GlowingText>Gents</GlowingText>
                <LinearProgress
                    sx={{
                        height: "8px",
                        width: "70%",
                        margin: "0 auto",
                        borderRadius: "8px",
                    }}
                    variant="indeterminate"
                    color="primary"
                />
            </ImageContainer>
        </Box>
    );
};

export default LoadingFallback;

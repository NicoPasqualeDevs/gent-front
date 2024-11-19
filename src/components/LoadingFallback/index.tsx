import { LinearProgress } from "@mui/material";
import React from "react";
import Box from "@mui/material/Box";
import GlowingText from "../GlowingText";
import textLogo from "@/assets/site/text-logo.png";
import { useAppContext } from "@/context";

const LoadingFallback: React.FC = () => {
    const { fontLoaded } = useAppContext();
    return (
        <Box sx={{
            textAlign: "center",
            height: "100vh",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center"
        }}><Box>
                {fontLoaded && (
                    <Box sx={{ mb: 4 }}>
                        <img
                            src={textLogo}
                            alt="gENTS"
                            style={{
                                width: '300px',
                                marginTop: "-162px",
                                height: '88px',
                                filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.2))'
                            }}
                        />
                    </Box>
                )}
                {!fontLoaded && (<>
                    <GlowingText>gENTS</GlowingText>
                    <LinearProgress
                        sx={{
                            height: "8px",
                            width: "70%",
                            margin: "0px auto",
                            mt: "-126px",
                            mb: "163px",
                            borderRadius: "8px",
                        }}
                        variant="indeterminate"
                        color="primary"
                    /> </>)}

            </Box>
        </Box>
    );
};

export default LoadingFallback;

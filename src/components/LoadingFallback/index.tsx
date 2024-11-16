import { LinearProgress} from "@mui/material";
import React from "react";
import Box from "@mui/material/Box";
import GlowingText from "../GlowingText";

const LoadingFallback: React.FC = () => {
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
                <GlowingText>Gents</GlowingText>
                <LinearProgress
                    sx={{
                        height: "8px",
                        width: "70%",
                        margin: "0px auto",
                        mt: "-142px",
                        mb: "163px",
                        borderRadius: "8px",
                    }}
                    variant="indeterminate"
                    color="primary"
                />
            </Box>
        </Box>
    );
};

export default LoadingFallback;

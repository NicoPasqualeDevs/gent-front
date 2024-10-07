import { Backdrop, BoxProps, LinearProgress, styled } from "@mui/material";
import React from "react";
import Box from "@mui/material/Box";
import Logo from "@/components/Logo";

const ImageContainer = styled(Box)<BoxProps>(({ theme }) => ({
  "&.MuiBox-root": {
    background: theme.palette.primary.light,
    color: "#fff",
    borderRadius: "10px",
    padding: "8px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
}));

const StyledImage = styled(Logo)(() => ({
  width: "72px",
  borderRadius: "10px",
}));

const ModuleFallBack: React.FC = () => {
  return (
    <Backdrop sx={{ zIndex: 999 }} open={true}>
      <Box sx={{ textAlign: "center" }}>
        <ImageContainer sx={{ mb: 2 }}>
          <StyledImage />
        </ImageContainer>
        <LinearProgress
          sx={{
            height: "8px",
            width: "100%",
            borderRadius: "8px",
          }}
          variant="indeterminate"
          color="primary"
        />
      </Box>
    </Backdrop>
  );
};

export default ModuleFallBack;

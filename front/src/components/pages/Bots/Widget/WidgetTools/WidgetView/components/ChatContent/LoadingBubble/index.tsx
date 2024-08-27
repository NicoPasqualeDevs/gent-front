import { Box, Typography } from "@mui/material";

const LoadingBubble: React.FC = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Typography
        sx={{
          backgroundColor: "#ACACAC",
          color: "white",
          width: "30%",
          height: "30%",
          padding: "10px",
          textAlign: "center",
          borderRadius: "10px",
          fontSize: "100%",
          marginBottom: "5%",
          marginTop: "5%",
        }}
      >
        Cargando...
      </Typography>
    </Box>
  );
};

export default LoadingBubble;

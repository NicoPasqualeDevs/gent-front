import CircularProgress from "@mui/material/CircularProgress";
import { Box } from "@mui/material";

export const PageCircularProgress = () => {
  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <CircularProgress size={85} />
    </Box>
  );
};

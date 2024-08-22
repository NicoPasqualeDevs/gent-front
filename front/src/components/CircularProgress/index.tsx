import CircularProgress from '@mui/material/CircularProgress';
import { Box } from "@mui/material";

export const PageCircularProgress = () => {
  return (
    <Box sx={{ display: 'flex', padding:"144px"}} justifyContent={"center"} alignContent={"center"}>
      <CircularProgress size={85} />
    </Box>
  );
}
import { useWidgetContext } from "@/pages/Builder/Widget/WidgetContext";
import { Box } from "@mui/material";
import BrandImg from "./BrandImg";
import BackButton from "../BackButton";
import GreetingText from "./GreetingText";

const HeaderLayout: React.FC = () => {
  const { chatState } = useWidgetContext();

  return (
    <Box
      sx={{
        width: "90%",
        height: "90%",
      }}
    >
      <Box
        sx={{
          display: "flex",
          width: "100%",
          height: `${chatState ? "100%" : "50%"}`,
          transition: "height 0.5s",
        }}
      >
        <BrandImg />
        <BackButton />
      </Box>
      <GreetingText />
    </Box>
  );
};

export default HeaderLayout;

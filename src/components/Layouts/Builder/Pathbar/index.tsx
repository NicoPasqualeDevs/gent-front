import { PathButton } from "@/components/styledComponents/Layout";
import { useAppContext } from "@/context/app";
import theme from "@/styles/theme";
import { Box, Breadcrumbs, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { languages } from "@/utils/Traslations";

const Pathbar: React.FC = () => {
  const navigate = useNavigate();
  const { appNavigation, language } = useAppContext();
  const t = languages[language as keyof typeof languages];

  const getTranslatedLabel = (item: any) => {
    if (item.translationKey) {
      return t.leftMenu[item.translationKey as keyof typeof t.leftMenu] || item.label;
    }
    return item.label;
  };

  return (
    <Box
      sx={{
        backgroundColor: "transparent",
        display: "flex",
        alignItems: "center",
        flexGrow: 1,
        minWidth: "400px",
        overflow: "auto",
      }}
    >
      <Breadcrumbs
        separator={<Typography>/</Typography>}
        sx={{
          color: "white",
          maxHeight: "50px",
          marginTop: "4px",
          overflowY: "auto",
          whiteSpace: "nowrap",
          scrollBehavior: "smooth",
          scrollbarGutter: "none",
          scrollbarWidth: "thin",
          scrollbarColor: `${theme.palette.primary.main} transparent`,
          width: "100%",
        }}
      >
        {appNavigation.map((item, index) => {
          const translatedLabel = getTranslatedLabel(item);
          
          if (appNavigation.length - 1 === index) {
            return (
              <Typography 
                sx={{color:"secondary.light", paddingLeft:"5px"}} 
                variant="body2" 
                key={index}
              >
                {translatedLabel}
              </Typography>
            );
          }
          return (
            <PathButton
              size="small"
              key={index}
              onClick={() => {
                navigate(item.current_path);
              }}
            >
              {translatedLabel}
            </PathButton>
          );
        })}
      </Breadcrumbs>
    </Box>
  );
};

export default Pathbar;

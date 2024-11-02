import { PathButton } from "@/components/styledComponents/Layout";
import { useAppContext } from "@/context/app";
import theme from "@/styles/theme";
import { Box, Breadcrumbs, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { languages } from "@/utils/Traslations";
import { useEffect, useState } from "react";

const Pathbar: React.FC = () => {
  const navigate = useNavigate();
  const { appNavigation, language } = useAppContext();
  const [translations, setTranslations] = useState(languages[language as keyof typeof languages]);

  useEffect(() => {
    setTranslations(languages[language as keyof typeof languages]);
  }, [language]);

  const getTranslatedLabel = (item: any) => {
    if (item.translationKey && translations.leftMenu[item.translationKey as keyof typeof translations.leftMenu]) {
      return translations.leftMenu[item.translationKey as keyof typeof translations.leftMenu];
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
                data-translation-key={item.translationKey}
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
              data-translation-key={item.translationKey}
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

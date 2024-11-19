import { Box, Breadcrumbs, Typography } from "@mui/material";
import { useAppContext } from "@/context";
import { languages } from "@/utils/Traslations";
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { PathData } from "@/types/Pathbar";
import { useNavigate } from "react-router-dom";

const Pathbar: React.FC = () => {
  const { appNavigation, language } = useAppContext();
  const navigate = useNavigate();
  const t = languages[language as keyof typeof languages];

  const getTranslation = (path: PathData) => {
    const key = path.translationKey as keyof typeof t.leftMenu;
    return t.leftMenu[key] || path.label;
  };

  const handleFirstPathClick = () => {
    if (appNavigation.length > 1) {
      navigate(-1);
    }
  };

  if (!appNavigation.length) {
    return null;
  }

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
        separator={<NavigateNextIcon fontSize="small" />}
        aria-label="breadcrumb"
      >
        {appNavigation.map((path, index) => (
          <Typography
            key={`path-${index}`}
            color={index === 0 && appNavigation.length > 1 ? "primary.light" : "text.primary"}
            onClick={index === 0 && appNavigation.length > 1 ? handleFirstPathClick : undefined}
            sx={{
              cursor: index === 0 && appNavigation.length > 1 ? "pointer" : "default",
              fontSize: "0.9rem",
              pt: "2px",
              '&:hover': {
                textDecoration: index === 0 && appNavigation.length > 1 ? 'underline' : 'none',
              }
            }}
          >
            {getTranslation(path)}
          </Typography>
        ))}
      </Breadcrumbs>
    </Box>
  );
};

export default Pathbar;

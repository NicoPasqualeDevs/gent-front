import { Box, Breadcrumbs, Typography } from "@mui/material";
import { useAppContext } from "@/context/app";
import { languages } from "@/utils/Traslations";
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { PathData } from "@/types/Pathbar";

const Pathbar: React.FC = () => {
  const { appNavigation, language } = useAppContext();
  const t = languages[language as keyof typeof languages];

  const getTranslation = (path: PathData) => {
    const key = path.translationKey as keyof typeof t.leftMenu;
    return t.leftMenu[key] || path.label;
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
        separator={<NavigateNextIcon fontSize="small" />}
        aria-label="breadcrumb"
      >
        {appNavigation.map((path, index) => (
          <Typography
            key={`path-${index}`}
            color="text.primary"
            sx={{
              cursor: "default",
              fontSize: "0.9rem"
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

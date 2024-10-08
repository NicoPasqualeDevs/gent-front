import { PathButton } from "@/components/styledComponents/Layout";
import { useAppContext } from "@/context/app";
import theme from "@/styles/theme";
import { Box, Breadcrumbs, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Pathbar: React.FC = () => {
  const navigate = useNavigate();
  const { appNavigation } = useAppContext();

  return (
    <Box
      sx={{
        backgroundColor: "transparent",
        display: "flex",
        alignItems: "center",
        flexGrow: 1,
        minWidth: "400px", // Añadido ancho mínimo de 400px
        overflow: "auto", // Añadido para manejar contenido que exceda el ancho mínimo
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
          width: "100%", // Asegura que el Breadcrumbs ocupe todo el ancho disponible
        }}
      >
        {appNavigation.map((item, index) => {
          if (appNavigation.length - 1 === index) {
            return <Typography sx={{color:"secondary.light", paddingLeft:"5px"}} variant="body2" key={index}>{item.label}</Typography>;
          }
          return (
            <PathButton
              size="small"
              key={index}
              onClick={() => {
                navigate(item.current_path);
              }}
            >
              {item.label}
            </PathButton>
          );
        })}
      </Breadcrumbs>
    </Box>
  );
};

export default Pathbar;

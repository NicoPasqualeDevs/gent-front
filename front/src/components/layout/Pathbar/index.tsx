import { PathButton } from "@/components/styledComponents/Layout";
import { useAppContext } from "@/context/app";
import theme from "@/styles/theme";
import { Box, Breadcrumbs, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Pathbar: React.FC = () => {
  const navigate = useNavigate();
  const { menu, appNavigation } = useAppContext();

  return (
    <Box
      sx={{
        position: "fixed",
        top: "70px",
        width: "98%",
        backgroundColor: "#0C0C22",
        height: "50px",
        zIndex: "101",
        display: "flex",
        alignItems: "center",
        paddingLeft: "10px",
      }}
    >
      <Breadcrumbs
        separator={<Typography>/</Typography>}
        sx={{
          paddingLeft: `${menu ? "220px" : "0px"}`,
          transition: `padding-left ${theme.transitions.duration.standard}ms`,
          color: "white",
          width: "100%",
          maxHeight: "50px",
          overflowY: "auto",
          whiteSpace: "nowrap",
          scrollBehavior: "smooth",
          scrollbarGutter: "none",
          scrollbarWidth: "thin",
          scrollbarColor: `${theme.palette.primary.main} transparent`,
        }}
      >
        {appNavigation.map((item, index) => {
          if (appNavigation.length - 1 === index) {
            return <Typography variant="body2">{item.label}</Typography>;
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

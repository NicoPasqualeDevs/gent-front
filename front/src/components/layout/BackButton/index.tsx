import { styled } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

const StyledBackButton = styled(ArrowBackIcon)(({ theme }) => ({
  "&.MuiSvgIcon-root": {
    color: "white",
    height: "32px",
    width: "32px !important",
    borderRadius: "16px",
    cursor:"pointer",
    transition: `${theme.transitions.duration.shortest}ms`
  },":hover":{
    color: theme.palette.primary.light,
  },
}));

const BackButton: React.FC = () => {
  const navigate = useNavigate();

  const handleClickBack = () => {
    navigate(-1);
  };

  return <StyledBackButton onClick={handleClickBack} />;
};

export default BackButton;

import React, { useState } from "react";
import {
  styled,
  Typography,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import { useAppContext } from "@/context/app";
import { useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import theme from "@/styles/theme";
import { ArrowBack } from "@mui/icons-material";

const DropDownMenuIcon = styled(MenuIcon)(({ theme }) => ({
  fontSize: "200%",
  color: "white",
  transition: `${theme.transitions.duration.standard}ms`,
  ":hover": {
    color: theme.palette.primary.main,
  },
}));

const BackButton = styled(ArrowBack)(({ theme }) => ({
  fontSize: "200%",
  color: "white",
  transition: `${theme.transitions.duration.standard}ms`,
  ":hover": {
    color: theme.palette.primary.main,
  },
}));

const NavButton = styled(Typography)(({ theme }) => ({
  fontSize: "130%",
  textAlign: "end",
  cursor: "pointer",
  color: "white",
  transition: `${theme.transitions.duration.standard}ms`,
  ":hover": {
    color: theme.palette.primary.main,
  },
}));

const ShortHeader: React.FC = () => {
  const navigate = useNavigate();
  const { navElevation, setNavElevation } = useAppContext();
  const [expand, setExpand] = useState<boolean>(false);

  return (
    <Box>
      <Accordion
        expanded={expand}
        sx={{
          backgroundColor: theme.palette.secondary.dark,
          position: "fixed",
          top: "0%",
          width: "100%",
          zIndex: "10",
        }}
      >
        <AccordionSummary
          onClick={(e) => {
            if (e.target !== e.currentTarget) return;
            setExpand(false);
          }}
          expandIcon={<DropDownMenuIcon onClick={() => setExpand(!expand)} />}
        >
          <BackButton onClick={() => navigate(-1)} />
        </AccordionSummary>
        <AccordionDetails>
          <NavButton
            sx={{
              color: `${navElevation === "builder"
                  ? theme.palette.primary.main
                  : "white"
                }`,
            }}
            onClick={() => {
              navigate("/builder");
              setNavElevation("builder");
            }}
          >
            Equipos IA
          </NavButton>
        </AccordionDetails>
        <AccordionDetails>
          <NavButton
            sx={{
              color: `${navElevation === "Register"
                  ? theme.palette.primary.main
                  : "white"
                }`,
            }}
            onClick={() => {
              navigate("/builder/form");
              setNavElevation("Register");
            }}
          >
            Registrar nuevo equipo
          </NavButton>
        </AccordionDetails>
        <AccordionDetails>
          {/*           <NavButton
            sx={{
              color: `${
                navElevation === "Tools" ? theme.palette.primary.main : "white"
              }`,
            }}
            onClick={() => {
              navigate("/bots/tools");
              setNavElevation("Tools");
            }}
          >
            Tools
          </NavButton> */}
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default ShortHeader;

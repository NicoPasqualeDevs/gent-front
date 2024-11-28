import React, { useState } from "react";
import { Box, Button, Paper } from "@mui/material";
import { useParams } from "react-router-dom";
import { useAppContext } from "@/context";

// Components
import DataEntry from "./slides/DataEntry";
import PromptTemplate from './slides/PromptTemplate';

// Utils
import {
  DashboardContainer,
  DashboardHeader,
  DashboardContent,
} from "@/utils/DashboardsUtils";

export const Knowledge: React.FC = () => {
  const [activeView, setActiveView] = useState<'knowledge' | 'prompt'>('knowledge');
  const { agentId } = useParams();

  return (
    <DashboardContainer>
      <DashboardHeader
        title="Gestión de Conocimiento"
        actions={
          <Box sx={{ 
            display: 'flex', 
            gap: 2,
            '& .MuiButton-root': {
              minWidth: '140px'
            }
          }}>
            <Button
              variant={activeView === 'knowledge' ? 'contained' : 'outlined'}
              onClick={() => setActiveView('knowledge')}
              sx={{
                color: 'white',
                borderColor: activeView === 'knowledge' ? 'primary.main' : 'primary.light',
                backgroundColor: activeView === 'knowledge' ? 'primary.main' : 'transparent',
                '&:hover': {
                  color: 'white',
                  borderColor: activeView === 'knowledge' ? 'primary.main' : 'primary.light',
                  backgroundColor: activeView === 'knowledge' ? 'primary.main' : 'transparent'
                }
              }}
            >
              Conocimiento
            </Button>
            <Button
              variant={activeView === 'prompt' ? 'contained' : 'outlined'}
              onClick={() => setActiveView('prompt')}
              sx={{
                color: 'white',
                borderColor: activeView === 'prompt' ? 'primary.main' : 'primary.light',
                backgroundColor: activeView === 'prompt' ? 'primary.main' : 'transparent',
                '&:hover': {
                  color: 'white',
                  borderColor: activeView === 'prompt' ? 'primary.main' : 'primary.light',
                  backgroundColor: activeView === 'prompt' ? 'primary.main' : 'transparent'
                }
              }}
            >
              Instrucciones
            </Button>
          </Box>
        }
      />

      <DashboardContent>
        <Paper elevation={3} sx={{
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          flex: 1,
          minHeight: 0,
          p: 3
        }}>
          {activeView === 'knowledge' ? <DataEntry /> : <PromptTemplate />}
        </Paper>
      </DashboardContent>
    </DashboardContainer>
  );
};

export default Knowledge;

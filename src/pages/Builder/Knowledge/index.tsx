import React, { useState } from "react";
import { Box, Button, Paper } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { useAppContext } from "@/context";
import ChatIcon from '@mui/icons-material/Chat';

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
  const navigate = useNavigate();

  return (
    <DashboardContainer>
      <DashboardHeader
        title="Gestión de Conocimiento"
        actions={
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            gap: 3,
          }}>
            <Button
              variant="outlined"
              onClick={() => navigate(`/chat/${agentId}`)}
              startIcon={<ChatIcon />}
              sx={{
                minWidth: '140px',
                whiteSpace: 'nowrap',
                height: '36px',
              }}
            >
              {"Probar Bot"}
            </Button>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant={activeView === 'knowledge' ? 'contained' : 'outlined'}
                onClick={() => setActiveView('knowledge')}
                sx={{
                  height: '36px',
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
                  height: '36px',
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
          </Box>
        }
      />

      <DashboardContent>
        <Paper elevation={3} sx={{
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          flex: 1,
          height: '100%',
          p: 3
        }}>
          {activeView === 'knowledge' ? <DataEntry /> : <PromptTemplate />}
        </Paper>
      </DashboardContent>
    </DashboardContainer>
  );
};

export default Knowledge;

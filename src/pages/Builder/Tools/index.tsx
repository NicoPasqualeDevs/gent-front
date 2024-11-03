import React, { useCallback, useEffect, useState } from "react";
import { useTheme } from "@mui/material/styles";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Card, CardContent, Typography, Stack, CardActions, Container, Box, Paper } from "@mui/material";
import { PageCircularProgress } from "@/components/CircularProgress";
import { ErrorToast, SuccessToast } from "@/components/Toast";
import useToolsApi from "@/hooks/useTools";
import { ToolData } from "@/types/Bots";
import { useAppContext } from "@/context/app";
import { languages } from "@/utils/Traslations";
import AddIcon from "@mui/icons-material/Add";
import { builderNavigationUtils } from '@/utils/NavigationUtils';

const Tools: React.FC = () => {
  const { aiTeamId, clientName, botName, botId } = useParams<{ aiTeamId: string; clientName: string; botName: string; botId: string }>();
  const { getClientTools, getBotTools, addToolToBot, removeToolFromBot } = useToolsApi();
  const [tools, setTools] = useState<ToolData[]>([]);
  const [agentTools, setAgentTools] = useState<ToolData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { auth, language, replacePath, appNavigation } = useAppContext();
  const t = languages[language as keyof typeof languages];
  const theme = useTheme();
  const navigate = useNavigate();

  const fetchTools = useCallback(async () => {
    if (!auth?.token || !botId) {
      ErrorToast(t.tools.errorToken);
      setIsLoading(false);
      return;
    }

    try {
      const [clientToolsResponse, botToolsResponse] = await Promise.all([
        getClientTools(auth.uuid),
        getBotTools(botId)
      ]);
      
      const allClientTools = clientToolsResponse.data;
      const botTools = botToolsResponse;

      setTools(allClientTools.filter((tool: ToolData) => !botTools.some((botTool: ToolData) => botTool.id === tool.id)));
      setAgentTools(botTools);
    } catch (error) {
      ErrorToast(t.tools.errorLoading);
      console.error("Error fetching tools:", error);
    } finally {
      setIsLoading(false);
    }
  }, [auth?.token, auth?.uuid, botId, getClientTools, getBotTools]);

  useEffect(() => {
    const updatePathAndFetchTools = async () => {
      if (aiTeamId && clientName && botName) {
        replacePath([
          ...appNavigation.slice(0, 1),
          { label: clientName, current_path: `/builder/agents/${clientName}/${aiTeamId}`, preview_path: "", translationKey: "" },
          { label: botName, current_path: `/builder/agents/tools/${aiTeamId}/${botName}`, preview_path: "", translationKey: "" },
          { label: t.tools.type, current_path: `/builder/agents/tools/${aiTeamId}/${botName}`, preview_path: "", translationKey: "" },
        ]);
      }
      await fetchTools();
    };
    updatePathAndFetchTools();
  }, [aiTeamId, clientName, botName, fetchTools, replacePath, appNavigation, t.tools.type]);

  const handleToolAction = async (toolId: number, action: 'relate' | 'unrelate') => {
    if (!botId) return;

    try {
      if (action === 'relate') {
        await addToolToBot(botId, [toolId]);
        SuccessToast(t.tools.successRelate);
      } else {
        await removeToolFromBot(botId, [toolId]);
        SuccessToast(t.tools.successUnrelate);
      }

      await fetchTools();
    } catch (error) {
      ErrorToast(action === 'relate' ? t.tools.errorRelate : t.tools.errorUnrelate);
      console.error(`Error during tool ${action}:`, error);
    }
  };

  const handleAddTool = () => {
    if (!aiTeamId || !botId) {
      ErrorToast(t.iaPanel.errorMissingParams);
      return;
    }
    
    builderNavigationUtils.toToolsForm(navigate, {
      aiTeamId,
      botId
    });
  };


  if (isLoading) {
    return <PageCircularProgress />;
  }

  return (
    <Container maxWidth="xl" sx={{ py: 2, px: { xs: 1, sm: 2, md: 3 } }}>
      {auth?.is_superuser && (
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddTool}
          sx={{ mb: 2, color: theme.palette.secondary.main }}
        >
          {t.tools.createToolButton}
        </Button>
      )}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Paper elevation={3} sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h4">{t.tools.libraryTitle}</Typography>
          </Box>
          {tools.map((tool) => (
            <Card key={tool.id} sx={{ marginBottom: 2 }}>
              <CardContent>
                <Typography variant="h6">{tool.tool_name}</Typography>
                <Stack direction="row" spacing={2}>
                  <Typography>ID: {tool.id}</Typography>
                  <Typography>{t.tools.type}: {tool.type}</Typography>
                </Stack>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  variant="contained"
                  onClick={() => handleToolAction(Number(tool.id), 'relate')}
                >
                  {t.tools.relateButton}
                </Button>
              </CardActions>
            </Card>
          ))}
        </Paper>
        <Paper elevation={3} sx={{ p: 2 }}>
          <Typography variant="h4" gutterBottom>{t.tools.relatedTitle}</Typography>
          {agentTools.map((tool) => (
            <Card key={tool.id} sx={{ marginBottom: 2 }}>
              <CardContent>
                <Typography variant="h6">{tool.tool_name}</Typography>
                <Stack direction="row" spacing={2}>
                  <Typography>ID: {tool.id}</Typography>
                  <Typography>{t.tools.type}: {tool.type}</Typography>
                </Stack>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  variant="contained"
                  color="secondary"
                  onClick={() => handleToolAction(Number(tool.id), 'unrelate')}
                >
                  {t.tools.unrelateButton}
                </Button>
              </CardActions>
            </Card>
          ))}
        </Paper>
      </Box>
    </Container>
  );
};

export default Tools;

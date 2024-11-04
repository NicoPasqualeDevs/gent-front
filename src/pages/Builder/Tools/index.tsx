import React, { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Typography, Container, Box, Paper } from "@mui/material";
import { PageCircularProgress } from "@/components/CircularProgress";
import { ErrorToast, SuccessToast } from "@/components/Toast";
import useToolsApi from "@/hooks/useTools";
import { ToolData } from "@/types/Tools";
import { useAppContext } from "@/context/app";
import { languages } from "@/utils/Traslations";
import { builderNavigationUtils } from '@/utils/NavigationUtils';
import { FormHeader } from "@/utils/FormsViewUtils";
import ToolCard from '@/components/ToolCard';

interface ToolsState {
  tools: ToolData[];
  agentTools: ToolData[];
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string;
}

const Tools: React.FC = () => {
  const navigate = useNavigate();
  const { aiTeamId, clientName, botName, botId } = useParams<{
    aiTeamId: string;
    clientName: string;
    botName: string;
    botId: string;
  }>();
  const { getClientTools, getBotTools, addToolToBot, removeToolFromBot } = useToolsApi();
  const { auth, language, replacePath, appNavigation } = useAppContext();
  const t = languages[language as keyof typeof languages];

  const [state, setState] = useState<ToolsState>({
    tools: [],
    agentTools: [],
    isLoading: true,
    isError: false,
    errorMessage: undefined
  });

  // Función memoizada para cargar los datos
  const loadToolsData = useCallback(async () => {
    if (!auth?.token || !auth?.uuid || !botId) return;

    try {
      const [clientToolsResponse, botToolsResponse] = await Promise.all([
        getClientTools(auth.uuid),
        getBotTools(botId)
      ]);

      const availableTools = clientToolsResponse.data.filter(
        tool => !botToolsResponse.data.some(botTool => botTool.id === tool.id)
      );

      setState(prev => ({
        ...prev,
        tools: availableTools,
        agentTools: botToolsResponse.data,
        isLoading: false
      }));
    } catch (error) {
      console.error("Error fetching tools:", error);
      setState(prev => ({
        ...prev,
        isError: true,
        errorMessage: t.tools.errorLoading,
        isLoading: false
      }));
      ErrorToast(t.tools.errorLoading);
    }
  }, [auth?.uuid, botId, getClientTools, getBotTools, t.tools.errorLoading]);

  // Efecto para cargar datos iniciales
  useEffect(() => {
    setState(prev => ({ ...prev, isLoading: true }));

    if (!auth?.token || !auth?.uuid || !botId) {
      setState(prev => ({ ...prev, isLoading: false }));
      ErrorToast(t.tools.errorToken);
      return;
    }

    loadToolsData();
  }, [auth?.uuid, botId]); // Removido loadToolsData de las dependencias

  // Efecto para actualizar el pathbar
  useEffect(() => {
    if (!aiTeamId || !clientName || !botName) return;

    replacePath([
      ...appNavigation.slice(0, 1),
      {
        label: clientName,
        current_path: `/builder/agents/${clientName}/${aiTeamId}`,
        preview_path: "",
        translationKey: ""
      },
      {
        label: botName,
        current_path: `/builder/agents/tools/${aiTeamId}/${botName}`,
        preview_path: "",
        translationKey: ""
      },
      {
        label: t.tools.type,
        current_path: `/builder/agents/tools/${aiTeamId}/${botName}`,
        preview_path: "",
        translationKey: ""
      },
    ]);
  }, [aiTeamId, clientName, botName]); // Removidas dependencias innecesarias

  const handleToolAction = useCallback(async (toolId: number, action: 'relate' | 'unrelate') => {
    if (!botId) {
      ErrorToast(t.tools.errorMissingBot);
      return;
    }

    try {
      setState(prev => ({ ...prev, isLoading: true }));

      if (action === 'relate') {
        await addToolToBot(botId, [toolId]);
        SuccessToast(t.tools.successRelate);
      } else {
        await removeToolFromBot(botId, [toolId]);
        SuccessToast(t.tools.successUnrelate);
      }

      await loadToolsData();
    } catch (error) {
      console.error(`Error during tool ${action}:`, error);
      ErrorToast(action === 'relate' ? t.tools.errorRelate : t.tools.errorUnrelate);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [botId, addToolToBot, removeToolFromBot, loadToolsData, t.tools]);

  useCallback(() => {
    if (!aiTeamId || !botId) {
      ErrorToast(t.iaPanel.errorMissingParams);
      return;
    }

    builderNavigationUtils.toToolsForm(navigate, {
      aiTeamId,
      botId
    });
  }, [aiTeamId, botId, navigate, t.iaPanel.errorMissingParams]);

  if (state.isLoading) {
    return <PageCircularProgress />;
  }

  return (
    <Container maxWidth="xl" sx={{ py: 2, px: { xs: 1, sm: 2, md: 3 } }}>
      <FormHeader title={t.tools.type} />
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Paper elevation={3} sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h4">{t.tools.libraryTitle}</Typography>
          </Box>
          {state.tools.length === 0 ? (
            <Typography variant="body1" sx={{ textAlign: 'center', py: 2 }}>
              {t.tools.noToolsAvailable}
            </Typography>
          ) : (
            state.tools.map((tool) => (
              <ToolCard
                key={tool.id}
                tool={tool}
                onAction={handleToolAction}
                actionType='relate'
              />
            ))
          )}
        </Paper>

        <Paper elevation={3} sx={{ p: 2 }}>
          <Typography variant="h4" gutterBottom>{t.tools.relatedTitle}</Typography>
          {state.agentTools.length === 0 ? (
            <Typography variant="body1" sx={{ textAlign: 'center', py: 2 }}>
              {t.tools.noRelatedTools}
            </Typography>
          ) : (
            state.agentTools.map((tool) => (
              <ToolCard
                key={tool.id}
                tool={tool}
                onAction={handleToolAction}
                actionType='unrelate'
              />
            ))
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default React.memo(Tools);

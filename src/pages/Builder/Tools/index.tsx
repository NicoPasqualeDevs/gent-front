import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTheme } from "@mui/material/styles";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Button, 
  Card, 
  CardContent, 
  Typography, 
  Stack, 
  CardActions, 
  Container, 
  Box, 
  Paper 
} from "@mui/material";
import { PageCircularProgress } from "@/components/CircularProgress";
import { ErrorToast, SuccessToast } from "@/components/Toast";
import useToolsApi from "@/hooks/useTools";
import { ToolData } from "@/types/Bots";
import { useAppContext } from "@/context/app";
import { languages } from "@/utils/Traslations";
import AddIcon from "@mui/icons-material/Add";
import { builderNavigationUtils } from '@/utils/NavigationUtils';

// Definimos la interfaz para el estado
interface ToolsState {
  tools: ToolData[];
  agentTools: ToolData[];
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string;
}

// Definimos la configuración inicial
interface ToolsConfig {
  auth: any;
  aiTeamId?: string;
  clientName?: string;
  botName?: string;
  botId?: string;
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
  const theme = useTheme();

  // Estado unificado
  const [state, setState] = useState<ToolsState>({
    tools: [],
    agentTools: [],
    isLoading: true,
    isError: false
  });

  // Configuración memoizada
  const config = useMemo<ToolsConfig>(() => ({
    auth,
    aiTeamId,
    clientName,
    botName,
    botId
  }), [auth, aiTeamId, clientName, botName, botId]);

  // API methods memoizados
  const apiMethods = useMemo(() => ({
    getClientTools,
    getBotTools,
    addToolToBot,
    removeToolFromBot
  }), [getClientTools, getBotTools, addToolToBot, removeToolFromBot]);

  // Memoizamos los componentes de UI
  const ToolCard = useMemo(() => ({ tool, onAction, actionType }: { 
    tool: ToolData; 
    onAction: (id: number, action: 'relate' | 'unrelate') => void;
    actionType: 'relate' | 'unrelate';
  }) => (
    <Card key={tool.id} sx={{ marginBottom: 2 }}>
      <CardContent>
        <Typography variant="h6">{tool.tool_name}</Typography>
        <Stack direction="row" spacing={2}>
          <Typography>ID: {tool.id}</Typography>
          <Typography>{t.tools.type}: {tool.type || t.tools.noType}</Typography>
        </Stack>
        {tool.instruction && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {tool.instruction}
          </Typography>
        )}
      </CardContent>
      <CardActions>
        <Button
          size="small"
          variant="contained"
          color={actionType === 'unrelate' ? 'secondary' : 'primary'}
          onClick={() => onAction(Number(tool.id), actionType)}
        >
          {actionType === 'relate' ? t.tools.relateButton : t.tools.unrelateButton}
        </Button>
      </CardActions>
    </Card>
  ), [t.tools.type, t.tools.noType, t.tools.relateButton, t.tools.unrelateButton]);

  // Optimizamos el efecto de carga inicial
  useEffect(() => {
    let mounted = true;

    const loadInitialData = async () => {
      if (!config.auth?.token || !config.auth?.uuid) {
        ErrorToast(t.tools.errorToken);
        setState(prev => ({ ...prev, isLoading: false }));
        return;
      }

      try {
        setState(prev => ({ ...prev, isLoading: true }));
        
        // Realizamos las peticiones en paralelo
        const [clientToolsResponse, botToolsResponse] = await Promise.all([
          apiMethods.getClientTools(config.auth.uuid),
          config.botId ? apiMethods.getBotTools(config.botId) : Promise.resolve({ data: [] })
        ]);

        if (!mounted) return;

        // Accedemos a data.data para obtener las herramientas
        const availableTools = clientToolsResponse.data.filter(
          (tool) => !botToolsResponse.data.some(botTool => botTool.id === tool.id)
        );

        setState(prev => ({
          ...prev,
          tools: availableTools,
          agentTools: botToolsResponse.data,
          isLoading: false
        }));
      } catch (error) {
        console.error("Error fetching tools:", error);
        if (mounted) {
          setState(prev => ({
            ...prev,
            isError: true,
            errorMessage: t.tools.errorLoading,
            isLoading: false
          }));
          ErrorToast(t.tools.errorLoading);
        }
      }
    };

    loadInitialData();

    return () => {
      mounted = false;
    };
  }, [config.auth?.token, config.auth?.uuid, config.botId]);

  // Separamos el efecto de actualización del pathbar
  useEffect(() => {
    if (config.aiTeamId && config.clientName && config.botName) {
      replacePath([
        ...appNavigation.slice(0, 1),
        { 
          label: config.clientName, 
          current_path: `/builder/agents/${config.clientName}/${config.aiTeamId}`, 
          preview_path: "", 
          translationKey: "" 
        },
        { 
          label: config.botName, 
          current_path: `/builder/agents/tools/${config.aiTeamId}/${config.botName}`, 
          preview_path: "", 
          translationKey: "" 
        },
        { 
          label: t.tools.type, 
          current_path: `/builder/agents/tools/${config.aiTeamId}/${config.botName}`, 
          preview_path: "", 
          translationKey: "" 
        },
      ]);
    }
  }, [config.aiTeamId, config.clientName, config.botName, replacePath, appNavigation, t.tools.type]);

  // Memoizamos el handler de acciones
  const handleToolAction = useCallback(async (toolId: number, action: 'relate' | 'unrelate') => {
    if (!config.botId) {
      ErrorToast(t.tools.errorMissingBot);
      return;
    }

    try {
      setState(prev => ({ ...prev, isLoading: true }));
      
      if (action === 'relate') {
        await apiMethods.addToolToBot(config.botId, [toolId]);
        SuccessToast(t.tools.successRelate);
      } else {
        await apiMethods.removeToolFromBot(config.botId, [toolId]);
        SuccessToast(t.tools.successUnrelate);
      }

      // Actualizamos el estado localmente en lugar de recargar todo
      setState(prev => {
        if (action === 'relate') {
          const tool = prev.tools.find(t => t.id === String(toolId));
          return {
            ...prev,
            tools: prev.tools.filter(t => t.id !== String(toolId)),
            agentTools: tool ? [...prev.agentTools, tool] : prev.agentTools,
            isLoading: false
          };
        } else {
          const tool = prev.agentTools.find(t => t.id === String(toolId));
          return {
            ...prev,
            agentTools: prev.agentTools.filter(t => t.id !== String(toolId)),
            tools: tool ? [...prev.tools, tool] : prev.tools,
            isLoading: false
          };
        }
      });
    } catch (error) {
      console.error(`Error during tool ${action}:`, error);
      ErrorToast(action === 'relate' ? t.tools.errorRelate : t.tools.errorUnrelate);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [config.botId, apiMethods, t.tools]);

  const handleAddTool = () => {
    if (!config.aiTeamId || !config.botId) {
      ErrorToast(t.iaPanel.errorMissingParams);
      return;
    }
    
    builderNavigationUtils.toToolsForm(navigate, {
      aiTeamId: config.aiTeamId,
      botId: config.botId
    });
  };

  if (state.isLoading) {
    return <PageCircularProgress />;
  }

  return (
    <Container maxWidth="xl" sx={{ py: 2, px: { xs: 1, sm: 2, md: 3 } }}>
      {config.auth?.is_superuser && (
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
          {state.tools.length === 0 ? (
            <Typography variant="body1" sx={{ textAlign: 'center', py: 2 }}>
              {t.tools.noToolsAvailable}
            </Typography>
          ) : (
            state.tools.map((tool) => ToolCard({ tool, onAction: handleToolAction, actionType: 'relate' }))
          )}
        </Paper>
        
        <Paper elevation={3} sx={{ p: 2 }}>
          <Typography variant="h4" gutterBottom>{t.tools.relatedTitle}</Typography>
          {state.agentTools.length === 0 ? (
            <Typography variant="body1" sx={{ textAlign: 'center', py: 2 }}>
              {t.tools.noRelatedTools}
            </Typography>
          ) : (
            state.agentTools.map((tool) => ToolCard({ tool, onAction: handleToolAction, actionType: 'unrelate' }))
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default React.memo(Tools);

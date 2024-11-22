import { FC, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Grid } from '@mui/material';
import RobotCard from '@/components/RobotCard';
import { AgentData } from '@/types/Agents';
import useAgentsApi from '@/hooks/apps/agents';
import { ErrorToast, SuccessToast } from '@/components/Toast';
import { useTranslation } from 'react-i18next';

interface AgentsListProps {
  onDelete?: (id: string) => Promise<void>;
  showActions?: boolean;
}

interface ListState {
  agents: AgentData[];
  isLoading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
}

interface ApiError {
  message: string;
  code?: string;
  details?: Record<string, unknown>;
}

const AgentsList: FC<AgentsListProps> = ({ onDelete, showActions = true }) => {
  const { teamId } = useParams<{ teamId: string }>();
  const [state, setState] = useState<ListState>({
    agents: [],
    isLoading: true,
    error: null,
    currentPage: 1,
    totalPages: 1
  });
  
  const navigate = useNavigate();
  const { getAgentsList } = useAgentsApi();
  const { t } = useTranslation();

  const handleApiError = (error: unknown): string => {
    if (error instanceof Error) {
      return error.message;
    }
    if (typeof error === 'object' && error !== null && 'message' in error) {
      return (error as ApiError).message;
    }
    return 'Error desconocido';
  };

  const loadAgents = async () => {
    if (!teamId) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'ID del equipo no disponible'
      }));
      return;
    }

    try {
      setState(prev => ({ ...prev, isLoading: true }));
      const response = await getAgentsList(teamId, `page=${state.currentPage}`);
      setState(prev => ({
        ...prev,
        agents: response.data || [],
        isLoading: false,
        totalPages: response.metadata?.total_pages || 1
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: handleApiError(error),
        isLoading: false
      }));
    }
  };

  const handleEdit = (id: string) => {
    navigate(`/builder/agents/${id}/edit`);
  };

  const handleDelete = async (id: string) => {
    if (onDelete) {
      try {
        await onDelete(id);
        SuccessToast(t('agentDeleted'));
        loadAgents();
      } catch (error) {
        ErrorToast(handleApiError(error));
      }
    }
  };

  useEffect(() => {
    if (teamId) {
      loadAgents();
    }
  }, [teamId, state.currentPage]);

  if (state.isLoading) {
    return <div>Cargando agentes...</div>;
  }

  if (!state.isLoading && state.agents.length === 0) {
    return <div>No hay agentes disponibles</div>;
  }

  if (state.error) {
    return <div>Error: {state.error}</div>;
  }

  return (
    <Grid container spacing={2}>
      {state.agents.map((agent) => (
        <Grid item xs={12} sm={6} md={4} key={agent.id}>
          <RobotCard
            robot={agent}
            onEdit={showActions ? handleEdit : undefined}
            onDelete={showActions ? handleDelete : undefined}
            showActions={showActions}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default AgentsList;

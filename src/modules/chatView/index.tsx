import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppContext } from '@/context/app';
import { PageCircularProgress } from '@/components/CircularProgress';
import { ModuleProps, ModuleState } from '@/types/Module';
import { ErrorToast } from '@/components/Toast';
import { languages } from "@/utils/Traslations";
import useBotsApi from "@/hooks/useBots";
import { AgentData } from "@/types/Bots";
import { ApiResponse } from "@/types/Api";

interface ChatViewState extends ModuleState {
  botData?: AgentData;
}

const ChatViewModule: React.FC<ModuleProps> = () => {
  const navigate = useNavigate();
  const { botId } = useParams();
  const { auth, language, replacePath } = useAppContext();
  const botsApi = useBotsApi();
  const [state, setState] = useState<ChatViewState>({
    isLoading: true,
    isError: false
  });
  const t = languages[language as keyof typeof languages];

  useEffect(() => {
    let isSubscribed = true;

    const initializeModule = async () => {
      try {
        if (!auth?.user?.uuid) {
          throw new Error('User not authenticated');
        }

        if (!botId) {
          throw new Error('Bot ID is required');
        }

        // Obtener detalles del bot
        const botDetails: ApiResponse<AgentData> = await botsApi.getBotDetails(botId);
        
        if (!isSubscribed) return;

        if (!botDetails?.data) {
          throw new Error('Bot not found');
        }

        // Configurar navegación
        replacePath([
          {
            label: t.leftMenu.aiTeams,
            current_path: "/builder",
            preview_path: "/builder",
          },
          {
            label: botDetails.data.name,
            current_path: `/builder/agents/chat/${botId}`,
            preview_path: "",
          },
        ]);

        setState(prev => ({ 
          ...prev, 
          isLoading: false,
          botData: botDetails.data
        }));

      } catch (error) {
        if (!isSubscribed) return;
        
        setState({ 
          isLoading: false, 
          isError: true, 
          errorMessage: error instanceof Error ? error.message : 'Unknown error' 
        });
        ErrorToast(t.actionAllower.fieldRequired);
        navigate('/builder');
      }
    };

    initializeModule();

    return () => {
      isSubscribed = false;
    };
  }, [auth?.user?.uuid, botId, navigate, replacePath, botsApi, t]);

  if (state.isLoading) {
    return <PageCircularProgress />;
  }

  if (state.isError || !state.botData) {
    return null;
  }

  return (
    <div>
      {/* Aquí va el componente de chat usando state.botData */}
    </div>
  );
};

export default ChatViewModule;

import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppContext } from '"@/context"';
import { ModuleProps } from '@/types/Module';
import { ErrorToast } from '@/components/Toast';
import { languages } from "@/utils/Traslations";
import useBotsApi from "@/hooks/useBots";
import { AgentData } from "@/types/Bots";
import useLoadingState from '@/hooks/useLoadingState';

const ChatViewModule: React.FC<ModuleProps> = () => {
  const navigate = useNavigate();
  const { botId } = useParams();
  const { auth, language, replacePath } = useAppContext();
  const botsApi = useBotsApi();
  const { state, setError, setData } = useLoadingState<AgentData>();
  const t = languages[language as keyof typeof languages];

  useEffect(() => {
    const initializeModule = async () => {
      try {
        if (!auth?.uuid) {
          throw new Error('User not authenticated');
        }

        if (!botId) {
          throw new Error('Bot ID is required');
        }

        const botDetails = await botsApi.getBotDetails(botId);
        
        if (!botDetails?.data) {
          throw new Error('Bot not found');
        }

        replacePath([
          {
            label: t.leftMenu.aiTeams,
            current_path: "/builder",
            preview_path: "/builder",
            translationKey: "leftMenu.aiTeams"
          },
          {
            label: botDetails.data.name,
            current_path: `/builder/agents/chat/${botId}`,
            preview_path: "",
            translationKey: "agents.chat"
          },
        ]);

        setData(botDetails.data);

      } catch (error) {
        setError(error instanceof Error ? error.message : 'Unknown error');
        ErrorToast(t.actionAllower.fieldRequired);
        navigate('/builder');
      }
    };

    initializeModule();
  }, [auth?.uuid, botId, navigate, replacePath, setData, setError, botsApi, t]);

  if (state.isError || !state.data) {
    return null;
  }

  return (
    <div>
      {/* Componente de chat usando state.data */}
    </div>
  );
};

export default ChatViewModule;

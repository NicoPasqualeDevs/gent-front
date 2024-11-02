import { useEffect, lazy, Suspense } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { useAppContext } from '@/context/app';
import LoadingFallback from '@/components/LoadingFallback';
import { ModuleProps } from '@/types/Module';
import { ErrorToast } from '@/components/Toast';
import { languages } from "@/utils/Traslations";
import useLoadingState from '@/hooks/useLoadingState';
import DelayedSuspense from '@/components/DelayedSuspense';

// Lazy loaded components
const AiTeamsList = lazy(() => import("@/pages/AiTeams/AiTeamsList"));
const AiTeamsForm = lazy(() => import("@/pages/AiTeams/AiTeamsForm"));
const ToolsForm = lazy(() => import("@/pages/Builder/ToolsForm/Admin"));
const AgentsDetailsModule = lazy(() => import("./agents"));
const ProfileModule = lazy(() => import("../../modules/profile"));
const ChatViewModule = lazy(() => import("@/pages/Builder/ChatView"));

const BuilderModule: React.FC<ModuleProps> = () => {
  const navigate = useNavigate();
  const { auth, language, replacePath, setNavElevation } = useAppContext();
  const { state, setError, resetState } = useLoadingState();
  const t = languages[language as keyof typeof languages];

  useEffect(() => {
    const initializeModule = async () => {
      try {
        if (!auth?.uuid) {
          navigate('/auth/login');
          return;
        }

        setNavElevation('builder');
        replacePath([
          {
            label: t.leftMenu.aiTeams,
            current_path: "/builder",
            preview_path: "",
            translationKey: "leftMenu.aiTeams"
          },
        ]);

        resetState();
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Unknown error');
        ErrorToast(t.actionAllower.fieldRequired);
      }
    };

    initializeModule();
  }, [auth?.uuid]);

  if (state.isLoading) {
    return <LoadingFallback />;
  }

  if (state.isError) {
    return null;
  }

  return (
    <Routes>
      <Route path="/" element={<AiTeamsList />} />
      <Route path="/form/:aiTeamName?/:aiTeamId?" element={<AiTeamsForm />} />
      <Route path="/profile/*" element={<ProfileModule />} />
      <Route path="/agents/*" element={<AgentsDetailsModule />} />
      <Route path="/admin-tools-form" element={<ToolsForm />} />
      <Route path="/chat/:botId" element={<ChatViewModule />} />
    </Routes>
  );
};

export default BuilderModule;

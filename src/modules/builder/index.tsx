import { useEffect, lazy } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { useAppContext } from '@/context';
import { ModuleProps } from '@/types/Module';
import { ErrorToast } from '@/components/Toast';
import { languages } from "@/utils/Traslations";
import useLoadingState from '@/hooks/useLoadingState';
import Register from '@/pages/Auth/Register';

// Lazy loaded components
const AiTeamsList = lazy(() => import("@/pages/Builder/Teams/List"));
const AiTeamsForm = lazy(() => import("@/pages/Builder/Teams/Forms"));
const ToolsForm = lazy(() => import("@/pages/Builder/ToolsForm/Admin"));
const AgentsDetailsModule = lazy(() => import("./agents"));
const ProfileModule = lazy(() => import("../../modules/profile"));

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
            label: t.leftMenu.teams,
            current_path: "/builder",
            preview_path: "",
            translationKey: "leftMenu.teams"
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

  if (state.isError) {
    return null;
  }

  return (
    <Routes>
      <Route path="/" element={<AiTeamsList />} />
      <Route path="/form/:teamName?/:teamId?" element={<AiTeamsForm />} />
      <Route path="/profile/*" element={<ProfileModule />} />
      <Route path="/agents/*" element={<AgentsDetailsModule />} />
      <Route path="/admin-tools-form" element={<ToolsForm />} />
      <Route path="register-user" element={<Register />} />
    </Routes>
  );
};

export default BuilderModule;

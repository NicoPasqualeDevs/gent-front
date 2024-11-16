import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '@/context';
import { ModuleProps } from '@/types/Module';
import { ErrorToast } from '@/components/Toast';
import { languages } from "@/utils/Traslations";
import useLoadingState from '@/hooks/useLoadingState';

const HomeModule: React.FC<ModuleProps> = () => {
  const navigate = useNavigate();
  const { auth, language } = useAppContext();
  const { state, setError, resetState } = useLoadingState();
  const t = languages[language as keyof typeof languages];

  useEffect(() => {
    const initializeModule = async () => {
      try {
        if (!auth?.uuid) {
          throw new Error('User not authenticated');
        }
        resetState();
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Unknown error');
        ErrorToast(t.actionAllower.fieldRequired);
        navigate('/auth/login');
      }
    };

    initializeModule();
  }, [auth?.uuid, navigate, t, resetState, setError]);

  if (state.isError) {
    return null;
  }

  return (
    <div>
      {/* Componentes del home */}
    </div>
  );
};

export default HomeModule;

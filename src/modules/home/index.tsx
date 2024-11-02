import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '@/context/app';
import { PageCircularProgress } from '@/components/CircularProgress';
import { ModuleProps, ModuleState } from '@/types/Module';
import { ErrorToast } from '@/components/Toast';
import { languages } from "@/utils/Traslations";

const HomeModule: React.FC<ModuleProps> = () => {
  const navigate = useNavigate();
  const { auth, language, replacePath } = useAppContext();
  const [state, setState] = useState<ModuleState>({
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

        // Configurar navegación
        replacePath([
          {
            label: t.leftMenu.workShop,
            current_path: "/home",
            preview_path: "",
          },
        ]);

        if (isSubscribed) {
          setState(prev => ({ ...prev, isLoading: false }));
        }
      } catch (error) {
        if (isSubscribed) {
          setState({ isLoading: false, isError: true, errorMessage: error instanceof Error ? error.message : 'Unknown error' });
          ErrorToast(t.actionAllower.fieldRequired);
          navigate('/auth/login');
        }
      }
    };

    initializeModule();

    return () => {
      isSubscribed = false;
    };
  }, [auth?.user?.uuid, navigate, replacePath, t]);

  if (state.isLoading) {
    return <PageCircularProgress />;
  }

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

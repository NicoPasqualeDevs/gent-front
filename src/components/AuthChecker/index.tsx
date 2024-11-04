import { ReactNode, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppContext } from '@/context/app';

interface AuthCheckerProps {
  children: ReactNode;
}

const AuthChecker: React.FC<AuthCheckerProps> = ({ children }) => {
  const { auth } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!auth?.token) {
      // Si no hay token, redirigir a login
      navigate('/auth/login', { 
        replace: true,
        state: { from: location.pathname }
      });
    }
  }, [auth, navigate, location]);

  // Si hay token, mostrar el contenido protegido
  return auth?.token ? <>{children}</> : null;
};

export default AuthChecker;

import React from "react";
/* import { useAppContext } from "@/context/app";
import { useNavigate } from "react-router-dom"; */

type Props = {
  children: React.ReactNode | React.ReactNode[];
};
const AuthChecker: React.FC<Props> = ({ children }) => {
/*   const navigate = useNavigate();
  const { auth } = useAppContext();
  useEffect(() => {
    if (!auth.user) {
      navigate("/auth/admLogin");
    }
  }, [auth]);

  if (!auth) return null; */
  return <React.Fragment>{children}</React.Fragment>;
};

export default AuthChecker;

import React, { useState, useEffect } from "react";
import WellcomeContainer from "./Wellcome";
import UserPanel from "./Main/User/Panel";
import { useNavigate, } from "react-router-dom";
import { useAppContext } from '@/context/app';

const HomeComponent: React.FC = () => {
  const { auth } = useAppContext();
  const [isWellcome, setIsWellcome] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (auth) {
      console.log("User data loaded", { user: auth, isWellcome });
    }
  }, [auth, isWellcome]);

  const handleStartClick = () => {
    setIsWellcome(false);
  };

  return (
     <>
      {auth?.is_superuser ? ()=> navigate("/builder") : (
        isWellcome ? <WellcomeContainer onStartClick={handleStartClick} /> : <UserPanel />
      )}
    </> 
  );
};

export default HomeComponent;

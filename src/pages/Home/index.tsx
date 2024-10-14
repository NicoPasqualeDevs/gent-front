import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "@/context/app/AppContext";
import WellcomeContainer from "./Wellcome";
import UserPanel from "./Main/User/Panel";
import { useNavigate, } from "react-router-dom";

const HomeComponent: React.FC = () => {
  const { auth } = useContext(AppContext);
  const [isWellcome, setIsWellcome] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.user) {
      console.log("User data loaded", { user: auth.user, isWellcome });
    }
  }, [auth, isWellcome]);

  const handleStartClick = () => {
    setIsWellcome(false);
  };

  return (
    <>
      {auth.user?.is_superuser ? ()=> navigate("/builder") : (
        isWellcome ? <WellcomeContainer onStartClick={handleStartClick} /> : <UserPanel />
      )}
    </>
  );
};

export default HomeComponent;

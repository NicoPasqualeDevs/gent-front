import React, { useState } from "react";
import WellcomeContainer from "./Wellcome";

const HomeComponent: React.FC = () => {
  const [isWellcome, setIsWellcome] = useState<boolean>(true);

  const handleStartClick = () => {
    setIsWellcome(false);
  };

  return (
    <>
      {isWellcome ? (
        <WellcomeContainer onStartClick={handleStartClick} />
      ) : (
        <div>GENTLEMANT LIST</div>
      )}
    </>
  );
};

export default HomeComponent;

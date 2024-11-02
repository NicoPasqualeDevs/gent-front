import React, { Suspense, useEffect, useState } from 'react';
import LoadingFallback from '@/components/LoadingFallback';

interface DelayedSuspenseProps {
  children: React.ReactNode;
  minimumDelay?: number;
}

const DelayedSuspense: React.FC<DelayedSuspenseProps> = ({ 
  children, 
  minimumDelay = 750 
}) => {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    setShouldRender(false);
    const timer = setTimeout(() => {
      setShouldRender(true);
    }, minimumDelay);

    return () => {
      clearTimeout(timer);
      setShouldRender(false);
    };
  }, [minimumDelay, children]);

  return (
    <Suspense fallback={<LoadingFallback />}>
      {shouldRender ? children : <LoadingFallback />}
    </Suspense>
  );
};

export default DelayedSuspense; 
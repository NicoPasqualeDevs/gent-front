import { useState, useEffect } from 'react';

export const useFontLoader = (fontFamily: string) => {
  const [fontLoaded, setFontLoaded] = useState(false);

  useEffect(() => {
    document.fonts.ready.then(() => {
      if (document.fonts.check(`1em ${fontFamily}`)) {
        setFontLoaded(true);
      }
    });
  }, [fontFamily]);

  return fontLoaded;
}; 
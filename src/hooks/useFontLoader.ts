import { useEffect, useState } from 'react';
import { useAppContext } from '@/context';
import { fontStorage } from '@/services/font';

export const useFontLoader = () => {
  const [localFontLoaded, setLocalFontLoaded] = useState(() => fontStorage().getFontLoaded());
  const [isLoading, setIsLoading] = useState(false);
  const context = useAppContext();

  useEffect(() => {
    const { saveFontLoaded } = fontStorage();
    setIsLoading(true);

    const loadFont = async () => {
      try {
        // Primero verificamos si la fuente ya está en el registro
        const existingFont = document.fonts.check('12px ROBO');
        if (existingFont) {
          context.setFontLoaded(true);
          setLocalFontLoaded(true);
          saveFontLoaded(true);
          return;
        }
        const font = new FontFace(
          'ROBO',
          `url('https://gentsbuilder.com/fonts/ROBO.woff2') format('woff2')`
        );

        if (font.family === 'ROBO') {
            context.setFontLoaded(true);
            setLocalFontLoaded(true);
            saveFontLoaded(true);
        }
      } catch (error) {
        context.setFontLoaded(true);
        setLocalFontLoaded(true);
        saveFontLoaded(true);
      } finally {
        setIsLoading(false);
      }
    };

    loadFont();
  }, [context.fontLoaded, localFontLoaded, isLoading, context]);

  return context.fontLoaded;
}; 
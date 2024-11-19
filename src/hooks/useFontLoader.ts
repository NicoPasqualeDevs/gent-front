import { useEffect } from 'react';
import { useAppContext } from '@/context';
import { fontStorage } from '@/services/font';

export const useFontLoader = () => {
  let contextFontLoaded, setContextFontLoaded;
  try {
    const context = useAppContext();
    contextFontLoaded = context.fontLoaded;
    setContextFontLoaded = context.setFontLoaded;
  } catch (error) {
    const { getFontLoaded } = fontStorage();
    return getFontLoaded();
  }

  useEffect(() => {
    if (contextFontLoaded) return;

    const { getFontLoaded, saveFontLoaded } = fontStorage();
    const isFontLoaded = getFontLoaded();

    if (isFontLoaded) {
      setContextFontLoaded(true);
      return;
    }

    const loadFont = async () => {
      try {
        const font = new FontFace(
          'ROBO',
          `url('https://gentsbuilder.com/fonts/ROBO.woff2') format('woff2')`
        );

        const loadedFont = await font.load();
        document.fonts.add(loadedFont);
        setContextFontLoaded(true);
        saveFontLoaded(true);
      } catch (error) {
        console.error('Error cargando la fuente:', error);
        setContextFontLoaded(true);
        saveFontLoaded(true);
      }
    };

    loadFont();
  }, [contextFontLoaded, setContextFontLoaded]);

  return contextFontLoaded;
}; 
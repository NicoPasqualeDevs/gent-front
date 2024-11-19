import { useEffect, useState } from 'react';
import { useAppContext } from '@/context';
import { fontStorage } from '@/services/font';

export const useFontLoader = () => {
  const [localFontLoaded, setLocalFontLoaded] = useState(() => fontStorage().getFontLoaded());
  let contextFontLoaded = false;
  let setContextFontLoaded: ((value: boolean) => void) | null = null;

  try {
    const context = useAppContext();
    contextFontLoaded = context.fontLoaded;
    setContextFontLoaded = (value: boolean) => context.setFontLoaded(value);
  } catch (error) {
    // Si no hay contexto, usamos el estado local
  }

  useEffect(() => {
    // Si ya está cargada en el contexto o localmente, no hacemos nada
    if (contextFontLoaded || localFontLoaded) return;

    const { saveFontLoaded } = fontStorage();

    const loadFont = async () => {
      try {
        const font = new FontFace(
          'ROBO',
          `url('https://gentsbuilder.com/fonts/ROBO.woff2') format('woff2')`
        );

        const loadedFont = await font.load();
        document.fonts.add(loadedFont);
        if (setContextFontLoaded) setContextFontLoaded(true);
        setLocalFontLoaded(true);
        saveFontLoaded(true);
      } catch (error) {
        console.error('Error cargando la fuente:', error);
        if (setContextFontLoaded) setContextFontLoaded(true);
        setLocalFontLoaded(true);
        saveFontLoaded(true);
      }
    };

    loadFont();
  }, [contextFontLoaded, localFontLoaded, setContextFontLoaded]);

  // Retornamos el estado del contexto si está disponible, si no, el estado local
  return contextFontLoaded || localFontLoaded;
}; 
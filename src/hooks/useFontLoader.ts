import { useEffect, useState } from 'react';
import { useAppContext } from '@/context';
import { fontStorage } from '@/services/font';

export const useFontLoader = () => {
  const [localFontLoaded, setLocalFontLoaded] = useState(() => fontStorage().getFontLoaded());
  const [isLoading, setIsLoading] = useState(false);
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
    // Evitamos múltiples intentos de carga
    if (isLoading || contextFontLoaded || localFontLoaded) return;

    const { saveFontLoaded } = fontStorage();
    setIsLoading(true);

    const loadFont = async () => {
      try {
        // Primero verificamos si la fuente ya está en el registro
        const existingFont = document.fonts.check('12px ROBO');
        if (existingFont) {
          if (setContextFontLoaded) setContextFontLoaded(true);
          setLocalFontLoaded(true);
          saveFontLoaded(true);
          return;
        }

        const font = new FontFace(
          'ROBO',
          `url('https://gentsbuilder.com/fonts/ROBO.woff2') format('woff2')`
        );

        // Establecemos un timeout para la carga de la fuente
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Font load timeout')), 5000);
        });

        const loadedFont = await Promise.race([
          font.load(),
          timeoutPromise
        ]);

        if (loadedFont instanceof FontFace) {
          document.fonts.add(loadedFont);
          // Verificamos que la fuente se haya cargado correctamente
          await document.fonts.ready;
          const fontLoaded = document.fonts.check('12px ROBO');
          
          if (fontLoaded) {
            if (setContextFontLoaded) setContextFontLoaded(true);
            setLocalFontLoaded(true);
            saveFontLoaded(true);
          }
        }
      } catch (error) {
        console.error('Error cargando la fuente:', error);
        // En caso de error, permitimos que la aplicación continúe con una fuente fallback
        if (setContextFontLoaded) setContextFontLoaded(true);
        setLocalFontLoaded(true);
        saveFontLoaded(true);
      } finally {
        setIsLoading(false);
      }
    };

    loadFont();
  }, [contextFontLoaded, localFontLoaded, setContextFontLoaded, isLoading]);

  // Retornamos el estado del contexto si está disponible, si no, el estado local
  return contextFontLoaded || localFontLoaded;
}; 
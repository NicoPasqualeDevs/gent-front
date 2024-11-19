import { useState, useEffect } from 'react';

export const useFontLoader = (fontFamily: string) => {
  const [fontLoaded, setFontLoaded] = useState(false);

  useEffect(() => {
    const loadFont = async () => {
      try {
        const font = new FontFace(
          'ROBO',
          `url('https://gentsbuilder.com/fonts/ROBO.woff2') format('woff2')`
        );

        // Esperar a que la fuente se cargue
        const loadedFont = await font.load();
        
        // Añadir la fuente al registro de fuentes del documento
        document.fonts.add(loadedFont);
        
        setFontLoaded(true);
      } catch (error) {
        console.error('Error cargando la fuente:', error);
        // En caso de error, mostramos el texto con una fuente fallback
        setFontLoaded(true);
      }
    };

    loadFont();
  }, []);

  return fontLoaded;
}; 
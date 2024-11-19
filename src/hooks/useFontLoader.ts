import { useState, useCallback } from 'react';


export const useFontLoader = () => {
    const [isLoading, setIsLoading] = useState(false);

    const loadFont = useCallback(async () => {
        if (isLoading) return false;
        
        setIsLoading(true);
        try {
            // Verificamos si la fuente ya está disponible en el documento
            const isFontAvailable = document.fonts.check('12px ROBO');
            if (isFontAvailable) {
                return true;
            }

            const font = new FontFace('ROBO', 'url(https://gentsbuilder.com/fonts/ROBO.woff2)');
            const loadedFont = await font.load();
            document.fonts.add(loadedFont);
            console.log(font, "<-- font")
            // Esperamos a que la fuente esté realmente lista
            await document.fonts.ready;
            
            // Verificación final
            const finalCheck = document.fonts.check('12px ROBO');
            console.log(finalCheck, "<-- finalCheck")
            if (!finalCheck) {
                throw new Error('La fuente no se cargó correctamente');
            }
            
            return true;
        } catch (error) {
            console.error('Error al cargar la fuente:', error);
            return false;
        } finally {
            setIsLoading(false);
        }
    }, [isLoading]);

    return { loadFont, isLoading };
}; 

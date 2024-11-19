import { useEffect, useState, useCallback } from 'react';
import { useAppContext } from '@/context';
import { fontStorage } from '@/services/font';

export const useFontLoader = () => {
    const [isLoading, setIsLoading] = useState(false);
    const context = useAppContext();
    const { saveFontLoaded } = fontStorage();

    const loadFont = useCallback(async () => {
        try {
            const response = await fetch('https://gentsbuilder.com/fonts/ROBO.woff2');
            console.log(response);
            if (response.ok) {
                context.setFontLoaded(true);
                setTimeout(() => {
                    saveFontLoaded(true);
                }, 500);
            } else {
                throw new Error('No se pudo cargar la fuente');
            }
        } catch (error) {
            console.error('Error al cargar la fuente:', error);
            saveFontLoaded(false);
            context.setFontLoaded(false);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!isLoading) {
            setIsLoading(true);
            loadFont();
        }
    }, [loadFont]);

    return context.fontLoaded;
}; 
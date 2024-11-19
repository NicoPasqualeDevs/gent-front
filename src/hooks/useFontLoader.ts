import { useState, useCallback } from 'react';
import { fontStorage } from '@/services/font';

export const useFontLoader = () => {
    const [isLoading, setIsLoading] = useState(false);

    const loadFont = useCallback(async () => {
        if (isLoading) return;
        
        setIsLoading(true);
        try {
            const response = await fetch('https://gentsbuilder.com/fonts/ROBO.woff2');
            if (response.ok) {
                setTimeout(() => {
                    fontStorage.saveFontLoaded(true);
                }, 500);
                return true;
            } else {
                throw new Error('No se pudo cargar la fuente');
            }
        } catch (error) {
            console.error('Error al cargar la fuente:', error);
            fontStorage.saveFontLoaded(false);
            return false;
        } finally {
            setIsLoading(false);
        }
    }, [isLoading]);

    return { loadFont, isLoading };
}; 

import { useEffect, useState } from 'react';
import { useAppContext } from '@/context';
import { fontStorage } from '@/services/font';

export const useFontLoader = () => {
    const [isLoading, setIsLoading] = useState(false);
    const context = useAppContext();

    useEffect(() => {
        const { saveFontLoaded } = fontStorage();
        setIsLoading(true);

        const loadFont = async () => {
            try {
                const font = new FontFace(
                    'ROBO',
                    `url('https://gentsbuilder.com/fonts/ROBO.woff2') format('woff2')`
                );
                if (font.family === 'ROBO') {
                    context.setFontLoaded(true);
                    saveFontLoaded(true);
                }
            } catch (error) {
                saveFontLoaded(false);
            } finally {
                setIsLoading(false);
            }
        };

        loadFont();
    }, [context.fontLoaded, isLoading]);

    return context.fontLoaded;
}; 
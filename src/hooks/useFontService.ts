import { useEffect } from 'react';
import { useAppContext } from "@/context";
import { useFontLoader } from "./useFontLoader";
import { fontStorage } from '@/services/font';

export const useFontService = () => {
    const { setFontLoaded } = useAppContext();
    const { loadFont } = useFontLoader();

    useEffect(() => {
        const initializeFont = async () => {
            const isFontLoaded = fontStorage.getFontLoaded();
            
            if (isFontLoaded) {
                setFontLoaded(true);
            } else {
                const success = await loadFont();
                if (success) {
                    fontStorage.saveFontLoaded(true);
                    setFontLoaded(true);
                } else {
                    fontStorage.saveFontLoaded(false);
                    setFontLoaded(false);
                }
            }
        };

        initializeFont();
    }, [loadFont, setFontLoaded]);

    return {
        getFontLoaded: fontStorage.getFontLoaded,
        saveFontLoaded: fontStorage.saveFontLoaded
    };
}; 
import { useEffect } from 'react';
import { useAppContext } from "@/context";
import { useFontLoader } from "./useFontLoader";
import { fontStorage } from '@/services/font';

export const useFontService = () => {
    const { setFontLoaded } = useAppContext();
    const { loadFont } = useFontLoader();

    useEffect(() => {
        const initializeFont = async () => {
            if (!fontStorage.getFontLoaded()) {
                const success = await loadFont();
                if (success) {
                    setFontLoaded(true);
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
import { useFontLoader } from "@/hooks/useFontLoader";
import { useAppContext } from "@/context";
const FONT_STORAGE_KEY = 'gents-font-loaded';

export const fontStorage = () => {
    const getFontLoaded = (): boolean => {
        try {
            if (sessionStorage.getItem(FONT_STORAGE_KEY)) {
                return true;
            }else{
                useFontLoader();
                return false;
            }
        } catch {
            return false;
        }
    };

    const saveFontLoaded = (loaded: boolean): void => {
        try {
            const context = useAppContext();
            context.setFontLoaded(loaded);
            sessionStorage.setItem(FONT_STORAGE_KEY, String(loaded));
        } catch (error) {
            console.error('Error saving font state:', error);
        }
    };

    return {
        getFontLoaded,
        saveFontLoaded,
    };
}; 
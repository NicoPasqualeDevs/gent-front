import { useFontLoader } from "@/hooks/useFontLoader";
const FONT_STORAGE_KEY = 'gents-font-loaded';

export const fontStorage = () => {
    const getFontLoaded = (): boolean => {
        try {
            if (sessionStorage.getItem(FONT_STORAGE_KEY)) {
                return true;
            }else{
                return useFontLoader();
            }
        } catch {
            return false;
        }
    };

    const saveFontLoaded = (loaded: boolean): void => {
        try {
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
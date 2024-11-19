const FONT_STORAGE_KEY = 'gents-font-loaded';

export const fontStorage = {
    getFontLoaded: (): boolean => {
        try {
            return !!sessionStorage.getItem(FONT_STORAGE_KEY);
        } catch {
            return false;
        }
    },

    saveFontLoaded: (loaded: boolean): void => {
        try {
            sessionStorage.setItem(FONT_STORAGE_KEY, String(loaded));
        } catch (error) {
            console.error('Error saving font state:', error);
        }
    }
}; 
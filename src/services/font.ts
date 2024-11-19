const FONT_STORAGE_KEY = 'gents-font-loaded';

export const fontStorage = () => {
  const getFontLoaded = (): boolean => {
    try {
      return localStorage.getItem(FONT_STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  };

  const saveFontLoaded = (loaded: boolean): void => {
    try {
      localStorage.setItem(FONT_STORAGE_KEY, String(loaded));
    } catch (error) {
      console.error('Error saving font state:', error);
    }
  };

  return {
    getFontLoaded,
    saveFontLoaded,
  };
}; 
const FONT_STORAGE_KEY = 'gents-font-loaded';

export const fontStorage = () => {
  const getFontLoaded = (): boolean => {
    try {
      if(localStorage.getItem(FONT_STORAGE_KEY) || sessionStorage.getItem(FONT_STORAGE_KEY)) {
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const saveFontLoaded = (loaded: boolean): void => {
    try {
      sessionStorage.setItem(FONT_STORAGE_KEY, String(loaded));
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
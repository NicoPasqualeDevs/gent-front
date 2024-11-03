export const languageStorage = () => {
  const LANGUAGE_KEY = 'app_language';

  const getLanguage = (): string => {
    const savedLanguage = localStorage.getItem(LANGUAGE_KEY);
    return savedLanguage || 'es'; // valor por defecto
  };

  const saveLanguage = (language: string): void => {
    localStorage.setItem(LANGUAGE_KEY, language);
  };

  return {
    getLanguage,
    saveLanguage,
  };
}; 
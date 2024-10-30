import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import languages from './Traslations';

i18n
  .use(initReactI18next)
  .init({
    resources: languages,
    lng: 'en', // idioma por defecto
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;

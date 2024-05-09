import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

import translationData from './locales/ar/translation.json';

const resources = {
  ar: {
    translation: translationData
  }
};

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en', 
    debug: true,
    interpolation: {
      escapeValue: false,
    }
  });

export default i18n;

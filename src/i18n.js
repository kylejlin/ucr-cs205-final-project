import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enLocales from './locales/en.json';
import jaLocales from './locales/ja.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enLocales
      },
      ja: {
        translation: jaLocales
      }
    },
    lng: 'en', // default language
    fallbackLng: 'en',

    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n;

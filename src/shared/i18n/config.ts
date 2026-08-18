import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { retrieveLaunchParams } from '@tma.js/sdk';

import en from './locales/en.json';
import ru from './locales/ru.json';
import am from './locales/am.json';

const resources = {
  en: { translation: en },
  ru: { translation: ru },
  am: { translation: am },
};

// Custom language detector to get language from Telegram Web App
const languageDetector = {
  type: 'languageDetector' as const,
  async: false,
  detect: () => {
    try {
      const launchParams = retrieveLaunchParams();
      const tgLang = (launchParams.initData as any)?.user?.languageCode;
      if (tgLang && ['en', 'ru', 'am'].includes(tgLang)) {
        return tgLang;
      }
      if (tgLang === 'be' || tgLang === 'uk' || tgLang === 'kk') {
          return 'ru'; // fallback similar languages to ru
      }
    } catch (e) {
      // Not running in Telegram environment or failed to parse
    }
    
    // Fallback to browser language
    const browserLang = navigator.language.split('-')[0];
    if (['en', 'ru', 'am'].includes(browserLang)) {
        return browserLang;
    }
    
    return 'en';
  },
  init: () => {},
  cacheUserLanguage: () => {},
};

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
          menu: {
            home: 'Home',
            profile: 'Profile',
            subscriptions: 'Subscriptions',
            administration: 'Administration',
            logout: 'Logout',
            blog: 'Blog',
            search: 'Search cities',
            statistics: 'Statistics'
          }
        }
      },
      it: {
        translation: {
          menu: {
            home: 'Home',
            profile: 'Profilo',
            subscriptions: 'Abbonamenti',
            administration: 'Amministrazione',
            logout: 'Logout',
            blog: 'Blog',
            search: 'Cerca città',
            statistics: 'Statistiche'
          }
        }
      }
    },
    fallbackLng: 'it',
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    }
  });

export default i18n;
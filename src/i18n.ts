import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { homeTranslations } from './i18n/translations/home';
import { blogTranslations } from './i18n/translations/blog';
import { searchTranslations } from './i18n/translations/search';
import { subscriptionsTranslations } from './i18n/translations/subscriptions';
import { menuTranslations } from './i18n/translations/menu';
import { profileTranslations } from './i18n/translations/profile';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
          menu: menuTranslations.en,
          home: homeTranslations.en,
          blog: blogTranslations.en,
          search: searchTranslations.en,
          subscriptions: subscriptionsTranslations.en,
          profile: profileTranslations.en
        }
      },
      it: {
        translation: {
          menu: menuTranslations.it,
          home: homeTranslations.it,
          blog: blogTranslations.it,
          search: searchTranslations.it,
          subscriptions: subscriptionsTranslations.it,
          profile: profileTranslations.it
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
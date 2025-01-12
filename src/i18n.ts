import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { supabase } from './integrations/supabase/client';

// Funzione per tradurre il testo
async function translateText(text: string, source: string, target: string) {
  try {
    const { data, error } = await supabase.functions.invoke('translate', {
      body: { text, source, target }
    });

    if (error) {
      console.error('Translation error:', error);
      return text;
    }

    return data.translation;
  } catch (error) {
    console.error('Translation service error:', error);
    return text;
  }
}

// Funzione per tradurre ricorsivamente un oggetto di risorse
async function translateResources(resources: any, source: string, target: string): Promise<any> {
  const translated: any = {};

  for (const key in resources) {
    if (typeof resources[key] === 'string') {
      translated[key] = await translateText(resources[key], source, target);
    } else if (typeof resources[key] === 'object') {
      translated[key] = await translateResources(resources[key], source, target);
    } else {
      translated[key] = resources[key];
    }
  }

  return translated;
}

const resources = {
  it: {
    translation: {
      menu: {
        home: 'Home',
        profile: 'Profilo',
        subscriptions: 'Abbonamenti',
        administration: 'Amministrazione',
        logout: 'Logout',
        blog: 'Blog',
        search: 'Cerca'
      }
    }
  }
};

// Estendi l'interfaccia di i18n per includere il nostro metodo personalizzato
declare module 'i18next' {
  interface i18n {
    loadAndSetLanguage(language: string): Promise<void>;
  }
}

const i18nInstance = i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'it',
    interpolation: {
      escapeValue: false
    }
  });

// Aggiungiamo il metodo per cambiare la lingua con traduzione automatica
i18n.loadAndSetLanguage = async (language: string) => {
  console.log(`Changing language to ${language}`);
  
  if (language === 'it') {
    await i18n.changeLanguage(language);
    return;
  }

  try {
    const currentResources = resources.it.translation;
    const translatedResources = await translateResources(currentResources, 'it', language);
    
    i18n.addResourceBundle(language, 'translation', translatedResources, true, true);
    await i18n.changeLanguage(language);
    
    console.log(`Language changed to ${language} successfully`);
  } catch (error) {
    console.error('Error changing language:', error);
  }
};

export default i18n;
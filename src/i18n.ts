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
          },
          home: {
            hero: {
              title: 'WayWonder - Explore the World',
              subtitle: 'Discover and plan your personalized routes in the most beautiful cities in the world',
              description: 'The ultimate platform to explore the wonders of the world through customized itineraries'
            },
            features: {
              planRoutes: {
                title: 'Plan Routes',
                description: 'Create personalized itineraries for your visits, optimized for time and budget'
              },
              exploreWorld: {
                title: 'Explore the World',
                description: 'Discover the most fascinating destinations and hidden treasures of every corner of the planet'
              },
              saveFavorites: {
                title: 'Save Favorites',
                description: 'Save and share your favorite itineraries with other travelers'
              },
              travelBlog: {
                title: 'Travel Blog',
                description: 'Share your travel experiences and discover stories from other travelers through our integrated blog'
              },
              premiumSubscriptions: {
                title: 'Premium Subscriptions',
                description: 'Unlock advanced features with our Silver and Gold plans to create more routes and access exclusive tools'
              }
            },
            why: {
              title: 'Why Choose WayWonder?',
              description1: 'WayWonder is the ideal solution for those who want to explore the world in a smart and personalized way. Our platform offers advanced tools for itinerary planning, allowing you to optimize your travels based on time, budget, and interests.',
              description2: 'With WayWonder, every journey becomes a tailored adventure. Our platform allows you to discover the wonders of each city, from famous monuments to lesser-known but equally fascinating places. Whether you\'re an experienced traveler or a beginner, you\'ll find the perfect tools to plan your next unforgettable trip.',
              description3: 'The WayWonder community consists of passionate travelers from around the world, ready to share experiences, advice, and personalized itineraries. Join us to discover new destinations, cultures, and traditions, creating memories that will last forever.'
            }
          },
          blog: {
            title: 'Blog',
            newPost: 'New Post',
            writePost: {
              title: 'Post Title',
              content: 'What do you want to share today?',
              publish: 'Publish',
              publishing: 'Publishing...',
              citySearch: 'Looking for a specific city?',
              coverImage: 'Cover Image',
              wordCount: 'words',
              remainingWords: 'remaining words'
            },
            noPosts: 'No posts published',
            readMore: 'Read more',
            loading: 'Loading posts...'
          },
          search: {
            title: 'Search Cities and Itineraries in Italy',
            subtitle: 'Search and discover the most beautiful Italian cities. Find personalized routes, read travel experiences, and plan your next itinerary with WayWonder.',
            searchPlaceholder: 'Search a city...',
            loading: 'Loading cities...',
            noResults: 'No cities found',
            backToSearch: 'Back to search'
          },
          subscriptions: {
            title: 'Choose Your Plan',
            description: 'Unlock all features and create unlimited routes',
            monthly: 'Monthly',
            yearly: 'Yearly',
            features: {
              routes: 'Routes per month',
              support: 'Priority support',
              analytics: 'Advanced analytics',
              export: 'Export routes'
            }
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
          },
          home: {
            hero: {
              title: 'WayWonder - Esplora il Mondo',
              subtitle: 'Scopri e pianifica i tuoi percorsi personalizzati nelle più belle città del mondo',
              description: 'La piattaforma definitiva per esplorare le meraviglie del mondo attraverso itinerari su misura'
            },
            features: {
              planRoutes: {
                title: 'Pianifica Percorsi',
                description: 'Crea itinerari personalizzati per le tue visite, ottimizzati per tempo e budget'
              },
              exploreWorld: {
                title: 'Esplora il Mondo',
                description: 'Scopri le destinazioni più affascinanti e i tesori nascosti di ogni angolo del pianeta'
              },
              saveFavorites: {
                title: 'Salva i Preferiti',
                description: 'Conserva e condividi i tuoi itinerari preferiti con altri viaggiatori'
              },
              travelBlog: {
                title: 'Blog di Viaggio',
                description: 'Condividi le tue esperienze di viaggio e scopri i racconti di altri viaggiatori attraverso il nostro blog integrato'
              },
              premiumSubscriptions: {
                title: 'Abbonamenti Premium',
                description: 'Sblocca funzionalità avanzate con i nostri piani Silver e Gold per creare più percorsi e accedere a strumenti esclusivi'
              }
            },
            why: {
              title: 'Perché Scegliere WayWonder?',
              description1: 'WayWonder è la soluzione ideale per chi desidera esplorare il mondo in modo intelligente e personalizzato. La nostra piattaforma offre strumenti avanzati per la pianificazione di itinerari, consentendoti di ottimizzare i tuoi viaggi in base a tempo, budget e interessi.',
              description2: 'Con WayWonder, ogni viaggio diventa un\'avventura su misura. La nostra piattaforma ti permette di scoprire le meraviglie di ogni città, dai monumenti più famosi ai luoghi meno conosciuti ma altrettanto affascinanti. Che tu sia un viaggiatore esperto o alle prime armi, troverai gli strumenti perfetti per pianificare il tuo prossimo viaggio indimenticabile.',
              description3: 'La community di WayWonder è composta da appassionati viaggiatori provenienti da tutto il mondo, pronti a condividere esperienze, consigli e itinerari personalizzati. Unisciti a noi per scoprire nuove destinazioni, culture e tradizioni, creando ricordi che dureranno per sempre.'
            }
          },
          blog: {
            title: 'Blog',
            newPost: 'Nuovo Post',
            writePost: {
              title: 'Titolo del post',
              content: 'Cosa vuoi condividere oggi?',
              publish: 'Pubblica',
              publishing: 'Pubblicazione...',
              citySearch: 'Cerchi una città specifica?',
              coverImage: 'Immagine di copertina',
              wordCount: 'parole',
              remainingWords: 'parole rimanenti'
            },
            noPosts: 'Nessun post pubblicato',
            readMore: 'Leggi di più',
            loading: 'Caricamento post...'
          },
          search: {
            title: 'Cerca Città e Itinerari in Italia',
            subtitle: 'Cerca e scopri le città italiane più belle. Trova percorsi personalizzati, leggi esperienze di viaggio e pianifica il tuo prossimo itinerario con WayWonder.',
            searchPlaceholder: 'Cerca una città...',
            loading: 'Caricamento città...',
            noResults: 'Nessuna città trovata',
            backToSearch: 'Torna alla ricerca'
          },
          subscriptions: {
            title: 'Scegli il Tuo Piano',
            description: 'Sblocca tutte le funzionalità e crea percorsi illimitati',
            monthly: 'Mensile',
            yearly: 'Annuale',
            features: {
              routes: 'Percorsi al mese',
              support: 'Supporto prioritario',
              analytics: 'Analisi avanzate',
              export: 'Esporta percorsi'
            }
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
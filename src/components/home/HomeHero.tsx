import React from 'react';
import { motion } from 'framer-motion';
import { Compass, Map, Heart } from 'lucide-react';

export const HomeHero = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto space-y-8 py-24 px-4 text-center"
      >
        <h1 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
          WayWonder - Esplora l'Italia
        </h1>
        <h2 className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
          Scopri e pianifica i tuoi percorsi personalizzati nelle più belle città italiane
        </h2>
        <p className="text-lg text-muted-foreground">
          La piattaforma definitiva per esplorare le meraviglie dell'Italia attraverso itinerari su misura
        </p>
      </motion.div>
      
      <div className="grid md:grid-cols-3 gap-6 text-center px-4 pb-12">
        <motion.article 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="p-6 space-y-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto">
            <Compass className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="font-semibold text-lg">Pianifica Percorsi</h3>
          <p className="text-muted-foreground">
            Crea itinerari personalizzati per le tue visite, ottimizzati per tempo e budget
          </p>
        </motion.article>
        
        <motion.article 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="p-6 space-y-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto">
            <Map className="h-6 w-6 text-purple-600 dark:text-purple-400" />
          </div>
          <h3 className="font-semibold text-lg">Esplora l'Italia</h3>
          <p className="text-muted-foreground">
            Scopri le destinazioni più affascinanti e i tesori nascosti del Bel Paese
          </p>
        </motion.article>
        
        <motion.article 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="p-6 space-y-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto">
            <Heart className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="font-semibold text-lg">Salva i Preferiti</h3>
          <p className="text-muted-foreground">
            Conserva e condividi i tuoi itinerari preferiti con altri viaggiatori
          </p>
        </motion.article>
      </div>

      <section className="max-w-4xl mx-auto px-4 pb-12 text-center">
        <h2 className="text-2xl font-semibold mb-4">
          Perché Scegliere WayWonder?
        </h2>
        <div className="prose prose-lg mx-auto dark:prose-invert">
          <p>
            WayWonder è la soluzione ideale per chi desidera esplorare l'Italia in modo intelligente e personalizzato.
            La nostra piattaforma offre strumenti avanzati per la pianificazione di itinerari, 
            consentendoti di ottimizzare i tuoi viaggi in base a tempo, budget e interessi.
          </p>
        </div>
      </section>
    </div>
  );
};
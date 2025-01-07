import React from 'react';
import { motion } from 'framer-motion';
import { Compass, Map, Heart } from 'lucide-react';

export const HomeHero = () => {
  return (
    <div className="relative overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto space-y-8 py-24 px-4 text-center"
      >
        <h1 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
          WayWonder
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
          Scopri e pianifica i tuoi percorsi personalizzati in Italia
        </p>
        <meta name="description" content="WayWonder - Pianifica i tuoi percorsi personalizzati in Italia. Scopri le meraviglie del Bel Paese con itinerari su misura." />
        <meta name="keywords" content="WayWonder, itinerari Italia, percorsi turistici, pianificazione viaggi, turismo Italia" />
      </motion.div>
      
      <div className="grid md:grid-cols-3 gap-6 text-center px-4 pb-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="p-6 space-y-4 bg-white/5 backdrop-blur-sm rounded-xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
            <Compass className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="font-semibold text-lg">Pianifica Percorsi</h3>
          <p className="text-muted-foreground">Crea itinerari personalizzati per le tue visite</p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="p-6 space-y-4 bg-white/5 backdrop-blur-sm rounded-xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
            <Map className="h-6 w-6 text-purple-600" />
          </div>
          <h3 className="font-semibold text-lg">Esplora l'Italia</h3>
          <p className="text-muted-foreground">Scopri le destinazioni più belle del paese</p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="p-6 space-y-4 bg-white/5 backdrop-blur-sm rounded-xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <Heart className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="font-semibold text-lg">Salva i Preferiti</h3>
          <p className="text-muted-foreground">Conserva i tuoi itinerari preferiti</p>
        </motion.div>
      </div>
    </div>
  );
};
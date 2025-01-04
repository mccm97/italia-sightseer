import React from 'react';
import { motion } from 'framer-motion';

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
          Italia Sightseer
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
          Pianifica i tuoi itinerari culturali in Italia con facilità e scopri le meraviglie del Bel Paese
        </p>
      </motion.div>
      
      <div className="grid md:grid-cols-3 gap-6 text-center px-4 pb-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="p-6 space-y-4 bg-white/5 backdrop-blur-sm rounded-xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
          </div>
          <h3 className="font-semibold text-lg">Pianifica Percorsi</h3>
          <p className="text-muted-foreground">Crea itinerari personalizzati per le tue visite culturali</p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="p-6 space-y-4 bg-white/5 backdrop-blur-sm rounded-xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="font-semibold text-lg">Calcola Tempi e Costi</h3>
          <p className="text-muted-foreground">Gestisci durata e budget del tuo itinerario</p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="p-6 space-y-4 bg-white/5 backdrop-blur-sm rounded-xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
            </svg>
          </div>
          <h3 className="font-semibold text-lg">Esplora le Città</h3>
          <p className="text-muted-foreground">Scopri i migliori percorsi nelle città italiane</p>
        </motion.div>
      </div>
    </div>
  );
};
import React from 'react';

export const HomeHero = () => {
  return (
    <>
      <div className="max-w-4xl mx-auto space-y-8 py-12">
        <h1 className="text-4xl font-bold text-primary">Italia Sightseer</h1>
        <p className="text-xl text-muted-foreground">
          Pianifica i tuoi itinerari culturali in Italia con facilità
        </p>
      </div>
      
      <div className="grid md:grid-cols-3 gap-6 text-center">
        <div className="p-6 space-y-2">
          <h3 className="font-semibold text-lg">Pianifica Percorsi</h3>
          <p className="text-muted-foreground">Crea itinerari personalizzati per le tue visite culturali</p>
        </div>
        <div className="p-6 space-y-2">
          <h3 className="font-semibold text-lg">Calcola Tempi e Costi</h3>
          <p className="text-muted-foreground">Gestisci durata e budget del tuo itinerario</p>
        </div>
        <div className="p-6 space-y-2">
          <h3 className="font-semibold text-lg">Esplora le Città</h3>
          <p className="text-muted-foreground">Scopri i migliori percorsi nelle città italiane</p>
        </div>
      </div>
    </>
  );
};
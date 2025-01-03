import React from 'react';
import { CitySearchButton } from './CitySearchButton';

export const HomeHero = ({ onCitySelect }: { 
  onCitySelect: (city: { id?: string; name: string; lat: number; lng: number; country?: string; }) => void 
}) => {
  return (
    <>
      <div className="max-w-4xl mx-auto space-y-8 py-12">
        <h1 className="text-4xl font-bold text-primary">Italia Sightseer</h1>
        <p className="text-xl text-muted-foreground">
          Pianifica i tuoi itinerari culturali in Italia con facilità
        </p>
      </div>
      
      <div className="aspect-video relative rounded-xl overflow-hidden shadow-xl">
        <img 
          src="/lovable-uploads/172840ab-5378-44c5-941a-9be547232b05.png" 
          alt="Vista panoramica di una città italiana" 
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <h2 className="text-2xl font-bold mb-2">Esplora le Città Italiane</h2>
          <p className="text-lg">Crea percorsi personalizzati e scopri i monumenti più belli</p>
        </div>
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

      <div className="max-w-xl mx-auto">
        <CitySearchButton onCitySelect={onCitySelect} />
      </div>
    </>
  );
};
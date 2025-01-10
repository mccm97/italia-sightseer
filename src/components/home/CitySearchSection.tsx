import React from 'react';
import { CitySearchButton } from './CitySearchButton';

interface City {
  id?: string;
  name: string;
  lat: number;
  lng: number;
  country?: string;
}

interface CitySearchSectionProps {
  setSelectedCity: (city: City | null) => void;
}

export function CitySearchSection({ setSelectedCity }: CitySearchSectionProps) {
  return (
    <div className="relative w-full h-[500px] rounded-xl overflow-hidden mb-12">
      <img 
        src="/lovable-uploads/73898f81-a447-4e14-8004-593893fda762.png" 
        alt="City background" 
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center p-6">
        <div className="max-w-2xl w-full mx-auto text-center">
          <h1 className="text-4xl font-bold text-white mb-8">
            Scopri la Tua Prossima Avventura
          </h1>
          <div className="w-full max-w-xl mx-auto">
            <CitySearchButton onCitySelect={setSelectedCity} />
          </div>
        </div>
      </div>
    </div>
  );
}
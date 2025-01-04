import React from 'react';
import { CitySearchButton } from './CitySearchButton';

interface CitySearchSectionProps {
  onCitySelect: (city: any) => void;
}

export function CitySearchSection({ onCitySelect }: CitySearchSectionProps) {
  return (
    <div className="relative w-full h-[400px] rounded-xl overflow-hidden mb-12">
      <img 
        src="/lovable-uploads/73898f81-a447-4e14-8004-593893fda762.png" 
        alt="City background" 
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center p-6">
        <div className="max-w-xl w-full">
          <CitySearchButton onCitySelect={onCitySelect} />
        </div>
      </div>
    </div>
  );
}
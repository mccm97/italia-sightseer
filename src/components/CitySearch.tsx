import React, { useState } from 'react';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';

interface City {
  id: string;
  name: string;
  lat: number;
  lng: number;
  country?: string;
}

interface CitySearchProps {
  cities?: City[];
  onCitySelect: (city: City) => void;
}

const CitySearch = ({ cities = [], onCitySelect }: CitySearchProps) => {
  const [search, setSearch] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  console.log('Cities received:', cities); // Debug log

  const filteredCities = cities?.filter(city =>
    city.name.toLowerCase().includes(search.toLowerCase())
  ) || [];

  return (
    <div className="relative w-full max-w-sm">
      <Input
        type="text"
        placeholder="Cerca una città..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setShowSuggestions(true);
        }}
        onFocus={() => setShowSuggestions(true)}
      />
      {showSuggestions && search && (
        <ScrollArea className="absolute z-50 w-full mt-1 bg-white rounded-md shadow-lg max-h-60">
          <div className="p-2">
            {filteredCities.length > 0 ? (
              filteredCities.map((city) => (
                <button
                  key={city.id}
                  className="w-full px-4 py-2 text-left hover:bg-gray-100 rounded-md"
                  onClick={() => {
                    onCitySelect(city);
                    setSearch(city.name);
                    setShowSuggestions(false);
                  }}
                >
                  {city.name}
                </button>
              ))
            ) : (
              <div className="px-4 py-2 text-gray-500">
                Nessuna città trovata
              </div>
            )}
          </div>
        </ScrollArea>
      )}
    </div>
  );
};

export default CitySearch;
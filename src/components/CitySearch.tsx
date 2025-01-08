import React, { useState, useEffect } from 'react';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './ui/use-toast';

interface City {
  id: string;
  name: string;
  lat: number;
  lng: number;
  country?: string;
}

interface CitySearchProps {
  onCitySelect: (city: City) => void;
}

export const CitySearch = ({ onCitySelect }: CitySearchProps) => {
  const [search, setSearch] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [cities, setCities] = useState<City[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCities = async () => {
      try {
        setIsLoading(true);
        console.log('Fetching cities from Supabase...');
        const { data, error } = await supabase
          .from('cities')
          .select('*');

        if (error) {
          console.error('Error fetching cities:', error);
          toast({
            title: 'Errore',
            description: 'Impossibile caricare le città',
            variant: 'destructive',
          });
          return;
        }

        console.log('Cities fetched:', data);
        setCities(data || []);
      } catch (error) {
        console.error('Error:', error);
        toast({
          title: 'Errore',
          description: 'Si è verificato un errore durante il caricamento delle città',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCities();
  }, [toast]);

  const filteredCities = cities.filter(city =>
    city.name.toLowerCase().includes(search.toLowerCase())
  );

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
        disabled={isLoading}
      />
      {showSuggestions && search && (
        <ScrollArea className="absolute z-50 w-full mt-1 bg-white rounded-md shadow-lg max-h-60">
          <div className="p-2">
            {isLoading ? (
              <div className="px-4 py-2 text-gray-500">
                Caricamento città...
              </div>
            ) : filteredCities.length > 0 ? (
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
                  {city.country && (
                    <span className="text-sm text-gray-500 ml-2">
                      ({city.country})
                    </span>
                  )}
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

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { City } from '@/types/route';

interface CitySearchProps {
  onCitySelect: (city: City | null) => void;
  selectedCountry?: string | null;
  disabled?: boolean;
}

export default function CitySearch({
  onCitySelect,
  selectedCountry,
  disabled = false
}: CitySearchProps) {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [cities, setCities] = useState<City[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (searchTerm.trim()) {
      loadCities(searchTerm.trim());
    } else {
      setCities([]);
    }
  }, [searchTerm, selectedCountry]);

  const loadCities = async (search: string) => {
    if (!search || !selectedCountry) {
      setCities([]);
      setError(null);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const { data, error: supabaseError } = await supabase
        .from('cities')
        .select('id, name, lat, lng, country')
        .eq('country', selectedCountry)
        .ilike('name', `%${search}%`)
        .order('name')
        .limit(10);

      if (supabaseError) {
        setError('Errore nel caricamento delle città');
        setCities([]);
        return;
      }

      setCities(data || []);
    } catch (error) {
      setError('Errore nel caricamento delle città');
      setCities([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Cerca città..."
        className="w-full"
        disabled={isLoading || !selectedCountry || disabled}
      />
      {error && <span className="text-red-500">{error}</span>}
      {isLoading ? (
        <div className="flex items-center justify-center py-2">
          Caricamento...
        </div>
      ) : (
        <ul>
          {cities.map((city) => (
            <li key={city.id}>
              <Button
                variant="outline"
                className="w-full text-left"
                onClick={() => onCitySelect(city)}
              >
                {city.name}
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

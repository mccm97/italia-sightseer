import React, { useState } from 'react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { City } from '@/types/route';

interface CitySearchProps {
  onCitySelect: (city: City | null) => void;
  selectedCountry?: string | null;
  disabled?: boolean;
}

export default function CitySearch({ onCitySelect, selectedCountry, disabled = false }: CitySearchProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<string>('');
  const [cities, setCities] = useState<City[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const loadCities = async (search: string) => {
    if (!search || !selectedCountry) {
      setCities([]);
      setError(null);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      console.log('Loading cities for search term:', search, 'in country:', selectedCountry);
      
      const { data, error: supabaseError } = await supabase
        .from('cities')
        .select('id, name, lat, lng, country')
        .eq('country', selectedCountry)
        .ilike('name', `%${search}%`)
        .order('name')
        .limit(10);
      
      if (supabaseError) {
        console.error('Error loading cities:', supabaseError);
        setError('Errore nel caricamento delle città');
        return;
      }

      if (!data) {
        console.log('No data returned from cities query');
        setCities([]);
        return;
      }

      // Filter out any invalid city data
      const validCities = data.filter((city): city is City => 
        typeof city.id === 'string' &&
        typeof city.name === 'string' &&
        typeof city.lat === 'number' &&
        typeof city.lng === 'number' &&
        typeof city.country === 'string'
      );

      console.log('Cities loaded:', validCities);
      setCities(validCities);
    } catch (error) {
      console.error('Error in loadCities:', error);
      setError('Errore nel caricamento delle città');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelect = (city: City) => {
    setValue(city.name);
    onCitySelect(city);
    setOpen(false);
  };

  const handleSearchChange = (search: string) => {
    setSearchTerm(search);
    if (search.trim()) {
      loadCities(search.trim());
    } else {
      setCities([]);
      setError(null);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between",
            disabled && "opacity-50 cursor-not-allowed"
          )}
          disabled={disabled}
        >
          {value || "Seleziona città..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput 
            placeholder="Cerca città..." 
            value={searchTerm}
            onValueChange={handleSearchChange}
            disabled={isLoading || !selectedCountry}
          />
          <CommandEmpty>
            {!selectedCountry ? (
              "Seleziona prima una nazione"
            ) : error ? (
              <span className="text-red-500">{error}</span>
            ) : isLoading ? (
              <div className="flex items-center justify-center py-2">
                Caricamento...
              </div>
            ) : searchTerm ? (
              "Nessuna città trovata."
            ) : (
              "Inizia a digitare per cercare..."
            )}
          </CommandEmpty>
          {!isLoading && !error && cities.length > 0 && (
            <CommandGroup>
              {cities.map((city) => (
                <CommandItem
                  key={city.id}
                  value={city.name}
                  onSelect={() => handleSelect(city)}
                  className="cursor-pointer"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === city.name ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {city.name}
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  );
}
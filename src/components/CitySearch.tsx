import React, { useState } from 'react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';

interface City {
  id: string;
  name: string;
  lat: number;
  lng: number;
  country: string;
}

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

  const loadCities = async (searchTerm: string) => {
    if (!searchTerm || !selectedCountry) {
      setCities([]);
      setError(null);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      console.log('Loading cities for search term:', searchTerm, 'in country:', selectedCountry);
      
      const { data, error: supabaseError } = await supabase
        .from('cities')
        .select('*')
        .eq('country', selectedCountry)
        .ilike('name', `%${searchTerm}%`)
        .limit(5);
      
      if (supabaseError) {
        console.error('Error loading cities:', supabaseError);
        setError('Errore nel caricamento delle città');
        setCities([]);
        return;
      }
    
      if (data) {
        console.log('Cities loaded:', data);
        setCities(data as City[]);
      } else {
        setCities([]);
      }
    } catch (error) {
      console.error('Error in loadCities:', error);
      setError('Errore nel caricamento delle città');
      setCities([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelect = (city: City) => {
    setValue(city.name);
    onCitySelect(city);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
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
            onValueChange={(search) => {
              if (search.trim()) {
                loadCities(search.trim());
              } else {
                setCities([]);
                setError(null);
              }
            }}
            disabled={isLoading}
          />
          {!selectedCountry ? (
            <CommandEmpty>Seleziona prima una nazione</CommandEmpty>
          ) : error ? (
            <CommandEmpty className="text-red-500">{error}</CommandEmpty>
          ) : isLoading ? (
            <CommandEmpty>Caricamento...</CommandEmpty>
          ) : cities.length === 0 ? (
            <CommandEmpty>Nessuna città trovata.</CommandEmpty>
          ) : (
            <CommandGroup>
              {cities.map((city) => (
                <CommandItem
                  key={city.id}
                  value={city.name}
                  onSelect={() => handleSelect(city)}
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
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
}

interface CitySearchProps {
  onCitySelect: (city: City | null) => void;
}

export default function CitySearch({ onCitySelect }: CitySearchProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<string>('');
  const [cities, setCities] = useState<City[]>([]);

  const loadCities = async (searchTerm: string) => {
    const { data } = await supabase
      .from('cities')
      .select('*')
      .ilike('name', `%${searchTerm}%`)
      .limit(5);
    
    if (data) {
      setCities(data);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
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
              if (search) loadCities(search);
            }}
          />
          <CommandEmpty>Nessuna città trovata.</CommandEmpty>
          <CommandGroup>
            {cities.map((city) => (
              <CommandItem
                key={city.id}
                value={city.name}
                onSelect={() => {
                  setValue(city.name);
                  onCitySelect(city);
                  setOpen(false);
                }}
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
        </Command>
      </PopoverContent>
    </Popover>
  );
}
import React, { useState, useEffect } from 'react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from "@/integrations/supabase/client";

interface CountrySelectProps {
  onCountrySelect: (country: string | null) => void;
}

export default function CountrySelect({ onCountrySelect }: CountrySelectProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<string>('');
  const [countries, setCountries] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCountries();
  }, []);

  const loadCountries = async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log('Loading countries...');
      
      const { data, error: supabaseError } = await supabase
        .from('cities')
        .select('country')
        .not('country', 'is', null)
        .order('country');

      if (supabaseError) {
        console.error('Error loading countries:', supabaseError);
        setError('Errore nel caricamento delle nazioni');
        setCountries([]);
        return;
      }
    
      if (data) {
        // Get unique countries and ensure they are strings
        const uniqueCountries = Array.from(new Set(data.map(item => item.country || ''))).filter(Boolean);
        console.log('Countries loaded:', uniqueCountries);
        setCountries(uniqueCountries.sort());
      } else {
        setCountries([]);
      }
    } catch (error) {
      console.error('Error in loadCountries:', error);
      setError('Errore nel caricamento delle nazioni');
      setCountries([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelect = (currentValue: string) => {
    setValue(currentValue);
    onCountrySelect(currentValue);
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
        >
          {value || "Seleziona nazione..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Cerca nazione..." />
          {error ? (
            <CommandEmpty className="text-red-500">{error}</CommandEmpty>
          ) : isLoading ? (
            <CommandEmpty>
              <div className="flex items-center justify-center py-2">
                Caricamento...
              </div>
            </CommandEmpty>
          ) : countries.length === 0 ? (
            <CommandEmpty>Nessuna nazione trovata.</CommandEmpty>
          ) : (
            <CommandGroup>
              {countries.map((country) => (
                <CommandItem
                  key={country}
                  value={country}
                  onSelect={() => handleSelect(country)}
                  className="cursor-pointer"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === country ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {country}
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  );
}
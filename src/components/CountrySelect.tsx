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
  const [isLoading, setIsLoading] = useState(true);
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
        .not('country', 'is', null);

      if (supabaseError) {
        console.error('Error loading countries:', supabaseError);
        setError('Errore nel caricamento delle nazioni');
        return;
      }

      if (!data || data.length === 0) {
        console.log('No countries found');
        setCountries([]);
        return;
      }

      // Get unique countries, filter out null/empty values, and sort
      const uniqueCountries = Array.from(
        new Set(
          data
            .map(item => item.country)
            .filter((country): country is string => 
              typeof country === 'string' && country.length > 0
            )
        )
      ).sort();

      console.log('Countries loaded:', uniqueCountries);
      setCountries(uniqueCountries);
    } catch (error) {
      console.error('Error in loadCountries:', error);
      setError('Errore nel caricamento delle nazioni');
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
          <CommandEmpty>
            {error ? (
              <span className="text-red-500">{error}</span>
            ) : isLoading ? (
              <div className="flex items-center justify-center py-2">
                Caricamento...
              </div>
            ) : (
              "Nessuna nazione trovata."
            )}
          </CommandEmpty>
          {!isLoading && !error && countries.length > 0 && (
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
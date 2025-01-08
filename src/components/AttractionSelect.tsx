import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";

interface AttractionSelectProps {
  value: string;
  onChange: (value: string) => void;
  inputType: 'name' | 'address';
  cityId?: string;
}

interface Attraction {
  name: string;
  source: 'local';
}

export function AttractionSelect({ value, onChange, inputType, cityId }: AttractionSelectProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 300);
  const [suggestions, setSuggestions] = useState<Attraction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Fetch attractions when city changes or on mount
  useEffect(() => {
    const fetchAttractions = async () => {
      if (!cityId) {
        setSuggestions([]);
        return;
      }
      
      setIsLoading(true);
      try {
        console.log('Fetching initial attractions for city:', cityId);
        const { data: localAttractions, error: localError } = await supabase
          .from('attractions')
          .select('name')
          .eq('city_id', cityId);

        if (localError) {
          console.error('Error fetching local attractions:', localError);
          throw localError;
        }

        const localResults = (localAttractions || []).map(attr => ({
          name: attr.name,
          source: 'local' as const
        }));

        console.log('Setting initial suggestions:', localResults);
        setSuggestions(localResults);
      } catch (error) {
        console.error('Error fetching initial attractions:', error);
        toast({
          title: "Errore",
          description: "Impossibile caricare i monumenti. Riprova più tardi.",
          variant: "destructive"
        });
        setSuggestions([]); 
      } finally {
        setIsLoading(false);
      }
    };

    fetchAttractions();
  }, [cityId, toast]);

  // Update suggestions when user types (using debounced search)
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!cityId || !debouncedSearch || debouncedSearch.length < 2) {
        return;
      }
      
      setIsLoading(true);
      try {
        console.log('Fetching suggestions for query:', debouncedSearch);
        const { data: localAttractions, error: localError } = await supabase
          .from('attractions')
          .select('name')
          .eq('city_id', cityId)
          .ilike('name', `%${debouncedSearch}%`);

        if (localError) {
          console.error('Error fetching local attractions:', localError);
          throw localError;
        }

        const localResults = (localAttractions || []).map(attr => ({
          name: attr.name,
          source: 'local' as const
        }));

        console.log('Setting filtered suggestions:', localResults);
        setSuggestions(localResults);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        toast({
          title: "Errore",
          description: "Impossibile caricare i suggerimenti. Riprova più tardi.",
          variant: "destructive"
        });
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSuggestions();
  }, [debouncedSearch, cityId, toast]);

  if (inputType === 'address') {
    return (
      <Input
        type="text"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Inserisci l'indirizzo esatto"
        className="w-full"
      />
    );
  }

  return (
    <Command className="rounded-lg border shadow-md">
      <CommandInput
        placeholder="Cerca monumento..."
        value={searchQuery}
        onValueChange={setSearchQuery}
      />
      <CommandEmpty>
        {searchQuery.length < 2 ? 
          "Digita almeno 2 caratteri per cercare" : 
          "Nessun monumento trovato"}
      </CommandEmpty>
      <CommandGroup>
        {isLoading ? (
          <div className="p-2 text-center text-gray-500">
            <Loader2 className="h-4 w-4 animate-spin inline mr-2" />
            Caricamento...
          </div>
        ) : suggestions && suggestions.length > 0 ? (
          suggestions.map((suggestion) => (
            <CommandItem
              key={suggestion.name}
              value={suggestion.name}
              onSelect={(currentValue) => {
                console.log('Selected value:', currentValue);
                onChange(currentValue);
                setSearchQuery(currentValue);
              }}
            >
              {suggestion.name}
            </CommandItem>
          ))
        ) : null}
      </CommandGroup>
    </Command>
  );
}
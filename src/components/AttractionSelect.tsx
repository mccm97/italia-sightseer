import React, { useState, useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { searchGeoapifyPlaces } from '../services/externalAttractions';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';

interface AttractionSelectProps {
  value: string;
  onChange: (value: string) => void;
  inputType: 'name' | 'address';
  cityId?: string;
  cityName?: string;
}

interface Attraction {
  name: string;
  distance?: string;
  source: 'local' | 'geoapify';
}

export function AttractionSelect({ value, onChange, inputType, cityId, cityName }: AttractionSelectProps) {
  const [searchQuery, setSearchQuery] = useState('');
  // Increased debounce delay to 800ms to allow for more typing
  const debouncedSearch = useDebounce(searchQuery, 800);
  const [suggestions, setSuggestions] = useState<Attraction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Fetch attractions when city changes or on mount
  useEffect(() => {
    const fetchAttractions = async () => {
      if (!cityId) return;
      
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

        setSuggestions(localResults);
      } catch (error) {
        console.error('Error fetching initial attractions:', error);
        toast({
          title: "Errore",
          description: "Impossibile caricare i monumenti. Riprova più tardi.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAttractions();
  }, [cityId, toast]);

  // Update suggestions when user types (using debounced search)
  useEffect(() => {
    const fetchSuggestions = async () => {
      // Only fetch if we have at least 2 characters
      if (!cityId || !cityName || !debouncedSearch || debouncedSearch.length < 2) return;
      
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

        const geoapifyAttractions = await searchGeoapifyPlaces(cityName, debouncedSearch);

        const localResults = (localAttractions || []).map(attr => ({
          name: attr.name,
          source: 'local' as const
        }));

        const geoapifyResults = geoapifyAttractions.map(attr => ({
          name: attr.name,
          distance: attr.distance,
          source: 'geoapify' as const
        }));

        const combined = [...localResults, ...geoapifyResults];
        const uniqueAttractions = Array.from(
          new Map(combined.map(item => [item.name, item])).values()
        );

        console.log('Combined unique attractions:', uniqueAttractions);
        setSuggestions(uniqueAttractions);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        toast({
          title: "Errore",
          description: "Impossibile caricare i suggerimenti. Riprova più tardi.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSuggestions();
  }, [debouncedSearch, cityId, cityName, toast]);

  if (inputType === 'address') {
    return (
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Inserisci l'indirizzo esatto"
        className="w-full"
      />
    );
  }

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Seleziona monumento" />
      </SelectTrigger>
      <SelectContent className="w-[300px]">
        <div className="p-2">
          <Input
            type="text"
            placeholder="Cerca..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="mb-2"
          />
        </div>
        <ScrollArea className="h-[200px]">
          {isLoading ? (
            <div className="p-2 text-center text-gray-500">
              <Loader2 className="h-4 w-4 animate-spin inline mr-2" />
              Caricamento...
            </div>
          ) : suggestions.length > 0 ? (
            suggestions.map((suggestion) => (
              <SelectItem key={suggestion.name} value={suggestion.name}>
                <div className="flex justify-between items-center">
                  <span>{suggestion.name}</span>
                  <span className="text-sm text-gray-500">
                    {suggestion.source === 'local' ? '(DB)' : suggestion.distance}
                  </span>
                </div>
              </SelectItem>
            ))
          ) : (
            <div className="p-2 text-center text-gray-500">
              {searchQuery.length < 2 ? 
                "Digita almeno 2 caratteri per cercare" : 
                searchQuery ? "Nessun risultato trovato" : "Nessun monumento disponibile"}
            </div>
          )}
        </ScrollArea>
      </SelectContent>
    </Select>
  );
}

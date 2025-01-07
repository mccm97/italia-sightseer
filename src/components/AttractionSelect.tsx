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
  const [suggestions, setSuggestions] = useState<Attraction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!searchQuery) return;
      
      setIsLoading(true);
      try {
        // Fetch local attractions from the database
        console.log('Fetching local attractions for city:', cityId);
        const { data: localAttractions, error: localError } = await supabase
          .from('attractions')
          .select('name')
          .eq('city_id', cityId)
          .ilike('name', `%${searchQuery}%`);

        if (localError) {
          console.error('Error fetching local attractions:', localError);
          throw localError;
        }

        console.log('Found local attractions:', localAttractions);

        // Fetch Geoapify attractions
        console.log('Fetching Geoapify attractions for city:', cityName);
        const geoapifyAttractions = cityName ? await searchGeoapifyPlaces(cityName, 'tourism') : [];
        console.log('Found Geoapify attractions:', geoapifyAttractions);

        // Combine and deduplicate results
        const localResults = (localAttractions || []).map(attr => ({
          name: attr.name,
          source: 'local' as const
        }));

        const geoapifyResults = geoapifyAttractions.map(attr => ({
          name: attr.name,
          distance: attr.distance,
          source: 'geoapify' as const
        }));

        // Combine and filter based on search query
        const combined = [...localResults, ...geoapifyResults]
          .filter(attr => attr.name.toLowerCase().includes(searchQuery.toLowerCase()));

        // Remove duplicates based on name
        const uniqueAttractions = Array.from(
          new Map(combined.map(item => [item.name, item])).values()
        );

        console.log('Combined unique attractions:', uniqueAttractions);
        setSuggestions(uniqueAttractions);
      } catch (error) {
        console.error('Error fetching attractions:', error);
        toast({
          title: "Errore",
          description: "Impossibile caricare i monumenti. Riprova più tardi.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery, cityId, cityName, toast]);

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
      <SelectContent>
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
            <div className="p-2 text-center text-gray-500">Caricamento...</div>
          ) : suggestions.length > 0 ? (
            suggestions.map((suggestion) => (
              <SelectItem key={suggestion.name} value={suggestion.name}>
                <div className="flex justify-between items-center">
                  <span>{suggestion.name}</span>
                  {suggestion.distance && (
                    <span className="text-sm text-gray-500">
                      {suggestion.source === 'local' ? '(DB)' : suggestion.distance}
                    </span>
                  )}
                </div>
              </SelectItem>
            ))
          ) : (
            <div className="p-2 text-center text-gray-500">
              {searchQuery ? "Nessun risultato trovato" : "Inizia a digitare per cercare"}
            </div>
          )}
        </ScrollArea>
      </SelectContent>
    </Select>
  );
}
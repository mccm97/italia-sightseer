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

interface AttractionSelectProps {
  value: string;
  onChange: (value: string) => void;
  inputType: 'name' | 'address';
  cityId?: string;
  cityName?: string;
}

export function AttractionSelect({ value, onChange, inputType, cityId, cityName }: AttractionSelectProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Array<{name: string, distance?: string}>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (cityName && searchQuery) {
        setIsLoading(true);
        try {
          console.log('Fetching attractions for city:', cityName);
          const places = await searchGeoapifyPlaces(cityName, 'tourism');
          const placeNames = places.map(place => ({
            name: place.name,
            distance: place.distance ? `${Math.round(place.distance)}m` : undefined
          }));
          console.log('Found attractions:', placeNames);
          setSuggestions(placeNames);
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
      }
    };

    const timeoutId = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery, cityName, toast]);

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
                    <span className="text-sm text-gray-500">{suggestion.distance}</span>
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
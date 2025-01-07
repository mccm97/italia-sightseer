import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getMonumentSuggestions } from '../services/attractions';
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
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (cityId && searchQuery) {
        setIsLoading(true);
        try {
          console.log('Fetching attractions for city:', cityId);
          const attractions = await getMonumentSuggestions(searchQuery, cityId);
          console.log('Found attractions:', attractions);
          setSuggestions(attractions);
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
  }, [searchQuery, cityId, toast]);

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
              <SelectItem key={suggestion} value={suggestion}>
                <div className="flex justify-between items-center">
                  <span>{suggestion}</span>
                </div>
              </SelectItem>
            ))
          ) : (
            <div className="p-2 text-center text-gray-500">Nessun risultato</div>
          )}
        </ScrollArea>
      </SelectContent>
    </Select>
  );
}

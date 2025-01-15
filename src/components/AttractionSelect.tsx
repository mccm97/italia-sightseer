import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';
import { Card } from './ui/card';

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
  source: 'local';
}

export function AttractionSelect({ value, onChange, inputType, cityId }: AttractionSelectProps) {
  const [searchQuery, setSearchQuery] = useState(value);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debouncedSearch = useDebounce(searchQuery, 300);
  const [suggestions, setSuggestions] = useState<Attraction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchAttractions = async () => {
      if (!cityId || !debouncedSearch || debouncedSearch.length < 2) {
        setSuggestions([]);
        return;
      }
      
      setIsLoading(true);
      try {
        console.log('Fetching suggestions for query:', debouncedSearch);
        const { data: localAttractions, error: localError } = await supabase
          .from('attractions')
          .select('name')
          .eq('city_id', cityId)
          .ilike('name', `%${debouncedSearch}%`)
          .limit(5);

        if (localError) {
          console.error('Error fetching local attractions:', localError);
          throw localError;
        }

        const results = (localAttractions || []).map(attr => ({
          name: attr.name,
          source: 'local' as const
        }));

        setSuggestions(results);
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

    fetchAttractions();
  }, [debouncedSearch, cityId, toast]);

  useEffect(() => {
    setSearchQuery(value);
  }, [value]);

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
    <div className="relative w-full">
      <Input
        type="text"
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value);
          setShowSuggestions(true);
        }}
        onFocus={() => setShowSuggestions(true)}
        placeholder="Cerca un monumento..."
        className="w-full"
      />
      
      {showSuggestions && searchQuery && (
        <Card className="absolute z-50 w-full mt-1 shadow-lg">
          <ScrollArea className="max-h-[200px]">
            {isLoading ? (
              <div className="p-2 text-center text-gray-500">
                <Loader2 className="h-4 w-4 animate-spin inline mr-2" />
                Caricamento...
              </div>
            ) : suggestions.length > 0 ? (
              <div className="p-2 space-y-1">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion.name}
                    className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded-md"
                    onClick={() => {
                      onChange(suggestion.name);
                      setSearchQuery(suggestion.name);
                      setShowSuggestions(false);
                    }}
                  >
                    {suggestion.name}
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-2 text-center text-gray-500">
                {searchQuery.length < 2 ? 
                  "Digita almeno 2 caratteri per cercare" : 
                  "Nessun monumento trovato"}
              </div>
            )}
          </ScrollArea>
        </Card>
      )}
    </div>
  );
}
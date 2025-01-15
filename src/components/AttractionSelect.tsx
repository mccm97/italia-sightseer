import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AttractionSelectProps {
  value: string;
  onChange: (value: string) => void;
  inputType: 'name' | 'address';
  cityId?: string;
}

interface Attraction {
  name: string;
  source: 'local';
  lat?: number;
  lng?: number;
}

export function AttractionSelect({ value, onChange, inputType, cityId }: AttractionSelectProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const [filteredAttractions, setFilteredAttractions] = useState<Attraction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchAttractions = async () => {
      if (!cityId) {
        setAttractions([]);
        return;
      }
      
      setIsLoading(true);
      try {
        console.log('Fetching attractions for city:', cityId);
        const { data: localAttractions, error: localError } = await supabase
          .from('attractions')
          .select('name, lat, lng')
          .eq('city_id', cityId)
          .order('name');

        if (localError) {
          console.error('Error fetching local attractions:', localError);
          throw localError;
        }

        console.log('Raw attractions data from database:', localAttractions);

        const results = (localAttractions || []).map(attr => ({
          name: attr.name,
          source: 'local' as const,
          lat: attr.lat,
          lng: attr.lng
        }));

        console.log('Processed attractions with coordinates:', results);
        setAttractions(results);
        setFilteredAttractions(results);
      } catch (error) {
        console.error('Error fetching attractions:', error);
        toast({
          title: "Errore",
          description: "Impossibile caricare le attrazioni. Riprova più tardi.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAttractions();
  }, [cityId, toast]);

  useEffect(() => {
    const filtered = attractions.filter(attraction =>
      attraction.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    console.log('Filtered attractions with coordinates:', filtered);
    setFilteredAttractions(filtered);
  }, [searchQuery, attractions]);

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
    <Select
      value={value}
      onValueChange={(value) => {
        onChange(value);
        setSearchQuery('');
        setIsOpen(false);
      }}
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Seleziona un monumento..." />
      </SelectTrigger>
      <SelectContent>
        <div className="p-2">
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cerca monumento..."
            className="mb-2"
          />
        </div>
        <ScrollArea className="h-[200px]">
          {isLoading ? (
            <div className="p-2 text-center text-gray-500">
              <Loader2 className="h-4 w-4 animate-spin inline mr-2" />
              Caricamento...
            </div>
          ) : filteredAttractions.length > 0 ? (
            filteredAttractions.map((attraction) => (
              <SelectItem 
                key={attraction.name} 
                value={attraction.name}
              >
                {attraction.name}
              </SelectItem>
            ))
          ) : (
            <div className="p-2 text-center text-gray-500">
              Nessun monumento trovato
            </div>
          )}
        </ScrollArea>
      </SelectContent>
    </Select>
  );
}
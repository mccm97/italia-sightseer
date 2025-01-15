import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Attraction {
  name: string;
  source: 'local';
  lat?: number;
  lng?: number;
  visitDuration?: number;
  price?: number;
  attractionId?: string;
}

export function useAttractions(cityId?: string) {
  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const [filteredAttractions, setFilteredAttractions] = useState<Attraction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
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
          .select('id, name, lat, lng, visit_duration, price')
          .eq('city_id', cityId)
          .order('name');

        if (localError) {
          console.error('Error fetching local attractions:', localError);
          throw localError;
        }

        console.log('Raw attractions data from database:', localAttractions);

        const results = (localAttractions || []).map(attr => {
          console.log(`Processing attraction "${attr.name}":`, {
            lat: attr.lat,
            lng: attr.lng,
            visitDuration: attr.visit_duration,
            price: attr.price,
            id: attr.id
          });

          return {
            name: attr.name,
            source: 'local' as const,
            lat: attr.lat,
            lng: attr.lng,
            visitDuration: attr.visit_duration,
            price: attr.price,
            attractionId: attr.id
          };
        });

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

  return {
    attractions,
    filteredAttractions,
    isLoading,
    searchQuery,
    setSearchQuery
  };
}
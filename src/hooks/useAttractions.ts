
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { fetchAttractionsFromOverpass, OverpassAttraction } from '@/services/overpassService';

export interface Attraction {
  name: string;
  source: 'local' | 'overpass';
  lat?: number;
  lng?: number;
  visitDuration?: number;
  price?: number;
  attractionId?: string;
  type?: string;
  id?: number;
}

export function useAttractions(cityId?: string) {
  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const [filteredAttractions, setFilteredAttractions] = useState<Attraction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const fetchAttractions = async () => {
      setIsLoading(true);
      try {
        let localResults: Attraction[] = [];
        let cityName = '';
        let countryName = '';
        
        // If we have a cityId, try to get attractions from the database
        if (cityId) {
          console.log('Fetching attractions for city:', cityId);
          // First get the city and country name for Overpass API
          const { data: cityData, error: cityError } = await supabase
            .from('cities')
            .select('name, country')
            .eq('id', cityId)
            .single();
          
          if (cityError) {
            console.error('Error fetching city data:', cityError);
          } else if (cityData) {
            cityName = cityData.name;
            countryName = cityData.country;
          }
          
          // Get local attractions from database
          const { data: localAttractions, error: localError } = await supabase
            .from('attractions')
            .select('id, name, lat, lng, visit_duration, price')
            .eq('city_id', cityId)
            .order('name');

          if (localError) {
            console.error('Error fetching local attractions:', localError);
          } else {
            console.log('Raw attractions data from database:', localAttractions);

            localResults = (localAttractions || []).map(attr => ({
              name: attr.name,
              source: 'local' as const,
              lat: attr.lat,
              lng: attr.lng,
              visitDuration: attr.visit_duration,
              price: attr.price,
              attractionId: attr.id
            }));
          }
        }

        // Even if we don't have a cityId or if the database search failed, 
        // we can still try to fetch from Overpass if we have city and country names
        let overpassResults: OverpassAttraction[] = [];
        if (cityName && countryName) {
          overpassResults = await fetchAttractionsFromOverpass(cityName, countryName);
          console.log('Fetched Overpass attractions:', overpassResults);
        }

        // Deduplicate attractions by name
        const nameSet = new Set(localResults.map(attr => attr.name.toLowerCase()));
        const uniqueOverpassResults = overpassResults.filter(
          attr => !nameSet.has(attr.name.toLowerCase())
        );

        const allResults = [...localResults, ...uniqueOverpassResults];
        console.log('Combined attractions:', allResults);

        setAttractions(allResults);
        setFilteredAttractions(allResults);
        
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

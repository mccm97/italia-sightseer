import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import CityMap from '../CityMap';

interface RouteMapViewProps {
  cityId?: string;
  attractions: Array<{
    name: string;
    position?: [number, number];
  }>;
}

export function RouteMapView({ cityId, attractions }: RouteMapViewProps) {
  const [cityCoordinates, setCityCoordinates] = useState<[number, number] | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCityCoordinates = async () => {
      if (!cityId) {
        console.error('No city ID provided');
        return;
      }

      try {
        console.log('Fetching coordinates for city:', cityId);
        const { data: city, error } = await supabase
          .from('cities')
          .select('lat, lng')
          .eq('id', cityId)
          .single();

        if (error) {
          throw error;
        }

        if (city) {
          console.log('City coordinates fetched:', city);
          setCityCoordinates([city.lat, city.lng]);
        }
      } catch (error) {
        console.error('Error fetching city coordinates:', error);
        toast({
          title: "Errore",
          description: "Impossibile caricare le coordinate della città",
          variant: "destructive"
        });
      }
    };

    if (cityId) {
      fetchCityCoordinates();
    }
  }, [cityId, toast]);

  // Verifica che ci siano attrazioni valide con coordinate
  const validAttractions = attractions.filter(attr => 
    attr.position && 
    Array.isArray(attr.position) && 
    attr.position.length === 2 &&
    !isNaN(attr.position[0]) && 
    !isNaN(attr.position[1])
  );

  console.log('Valid attractions for map:', validAttractions);

  if (!cityCoordinates) {
    return null;
  }

  return (
    <div className="mt-4 h-[300px] rounded-lg overflow-hidden">
      <CityMap
        center={cityCoordinates}
        attractions={validAttractions}
        showWalkingPath={true}
        zoom={13}
      />
    </div>
  );
}
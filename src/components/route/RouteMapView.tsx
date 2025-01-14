import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
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
  const [showMap, setShowMap] = useState(false);

  const handleMapClick = async () => {
    if (!cityId && !showMap) {
      toast({
        title: "Errore",
        description: "Impossibile caricare le coordinate della città",
        variant: "destructive"
      });
      return;
    }

    if (showMap) {
      setShowMap(false);
      return;
    }

    try {
      const { data: city } = await supabase
        .from('cities')
        .select('lat, lng')
        .eq('id', cityId)
        .single();

      if (city) {
        setCityCoordinates([city.lat, city.lng]);
        setShowMap(true);
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

  if (!showMap || !cityCoordinates) {
    return null;
  }

  return (
    <div className="mt-4 h-[300px] rounded-lg overflow-hidden">
      <CityMap
        center={cityCoordinates}
        attractions={attractions}
        showWalkingPath={true}
      />
    </div>
  );
}
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { CreateRouteFormData } from '@/types/route';

interface AttractionWithCoordinates {
  name: string;
  position: [number, number];
  visitDuration: number;
  price: number;
}

export function useAttractionCoordinates(formData: CreateRouteFormData) {
  const [attractions, setAttractions] = useState<AttractionWithCoordinates[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchAttractionCoordinates = async () => {
      if (!formData?.city?.id) {
        console.warn('No city ID provided');
        return;
      }

      try {
        console.log('Fetching coordinates for city:', formData.city.name);
        console.log('Attractions to fetch:', formData.attractions);
        
        const attractionPromises = formData.attractions.map(async (attr) => {
          if (!attr.name) {
            console.warn('Attraction name is missing:', attr);
            return null;
          }

          console.log('Fetching coordinates for attraction:', attr.name);

          const { data, error } = await supabase
            .from('attractions')
            .select('id, name, lat, lng, visit_duration, price')
            .eq('name', attr.name)
            .eq('city_id', formData.city?.id)
            .maybeSingle();

          if (error) {
            console.error('Error fetching coordinates for attraction:', attr.name, error);
            return null;
          }

          if (!data || typeof data.lat !== 'number' || typeof data.lng !== 'number') {
            console.error('Missing or invalid coordinates for attraction:', attr.name, data);
            return null;
          }

          console.log('Fetched data for attraction:', {
            name: attr.name,
            lat: data.lat,
            lng: data.lng,
            visitDuration: attr.visitDuration || data.visit_duration,
            price: attr.price || data.price
          });

          return {
            name: data.name,
            position: [data.lat, data.lng] as [number, number],
            visitDuration: attr.visitDuration || data.visit_duration,
            price: attr.price || data.price || 0
          };
        });

        const attractionsWithCoords = (await Promise.all(attractionPromises))
          .filter((attr): attr is AttractionWithCoordinates => {
            if (!attr) return false;
            const isValid = Array.isArray(attr.position) && 
                          attr.position.length === 2 && 
                          typeof attr.position[0] === 'number' && 
                          typeof attr.position[1] === 'number';
            if (!isValid) {
              console.error('Invalid coordinates for attraction:', attr);
            }
            return isValid;
          });

        console.log('All attractions with coordinates:', attractionsWithCoords);
        setAttractions(attractionsWithCoords);
      } catch (error) {
        console.error('Error fetching attraction coordinates:', error);
        toast({
          title: "Errore",
          description: "Impossibile caricare le coordinate delle attrazioni",
          variant: "destructive"
        });
      }
    };

    fetchAttractionCoordinates();
  }, [formData, toast]);

  return attractions;
}
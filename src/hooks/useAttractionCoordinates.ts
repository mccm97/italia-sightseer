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
        console.log('Fetching coordinates for attractions:', formData.attractions);
        console.log('City ID:', formData.city.id);
        
        const attractionPromises = formData.attractions.map(async (attr) => {
          if (!attr.name) {
            console.warn('Attraction name is missing:', attr);
            return null;
          }

          console.log('Fetching coordinates for attraction:', attr.name);

          const { data, error } = await supabase
            .from('attractions')
            .select('name, lat, lng, visit_duration, price')
            .eq('name', attr.name)
            .eq('city_id', formData.city?.id)
            .single();

          if (error) {
            console.error('Error fetching coordinates for attraction:', attr.name, error);
            return null;
          }

          if (!data || !data.lat || !data.lng) {
            console.error('Missing coordinates for attraction:', attr.name, data);
            return null;
          }

          console.log('Fetched data for', attr.name, ':', data);

          return {
            name: data.name,
            position: [data.lat, data.lng] as [number, number],
            visitDuration: attr.visitDuration || data.visit_duration,
            price: attr.price || data.price || 0
          };
        });

        const attractionsWithCoords = (await Promise.all(attractionPromises)).filter(Boolean) as AttractionWithCoordinates[];
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
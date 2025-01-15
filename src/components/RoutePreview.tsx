import { useState, useEffect } from 'react';
import CityMap from './CityMap';
import { RouteHeader } from './route/RouteHeader';
import { CreateRouteFormData } from '@/types/route';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface RoutePreviewProps {
  formData: CreateRouteFormData;
  onBack: () => void;
  onContinue: () => void;
}

export function RoutePreview({
  formData,
  onBack,
  onContinue
}: RoutePreviewProps) {
  const [attractions, setAttractions] = useState<Array<any>>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchAttractionCoordinates = async () => {
      if (!formData?.city?.id) return;

      try {
        const attractionPromises = formData.attractions.map(async (attr) => {
          if (attr.inputType === 'name') {
            const { data, error } = await supabase
              .from('attractions')
              .select('lat, lng')
              .eq('name', attr.name)
              .eq('city_id', formData.city?.id)
              .single();

            if (error) throw error;

            return {
              ...attr,
              lat: data?.lat || 0,
              lng: data?.lng || 0
            };
          }
          
          // For address type, we'll need to implement geocoding
          // For now, return with default coordinates
          return {
            ...attr,
            lat: formData.city?.lat || 0,
            lng: formData.city?.lng || 0
          };
        });

        const attractionsWithCoords = await Promise.all(attractionPromises);
        console.log('Attractions with coordinates:', attractionsWithCoords);
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

  if (!formData) return null;

  console.log('RoutePreview formData:', formData);

  return (
    <div className="space-y-4">
      <RouteHeader 
        onBack={onBack}
        onCreateRoute={onContinue}
      />
      <div className="h-[400px] relative">
        <CityMap
          center={[formData.city?.lat || 0, formData.city?.lng || 0]}
          attractions={attractions.map(attr => ({
            name: attr.name || attr.address,
            position: [attr.lat, attr.lng],
            visitDuration: attr.visitDuration,
            price: attr.price
          }))}
          zoom={13}
          showWalkingPath={true}
        />
      </div>
    </div>
  );
}
import { useState, useEffect } from 'react';
import CityMap from './CityMap';
import { RouteHeader } from './route/RouteHeader';
import { RouteCreationSummary } from './route/RouteCreationSummary';
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
      if (!formData?.city?.id) {
        console.warn('No city ID provided');
        return;
      }

      try {
        console.log('Fetching coordinates for attractions:', formData.attractions);
        
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

        const attractionsWithCoords = (await Promise.all(attractionPromises)).filter(Boolean);
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

  const calculateTotalDuration = () => {
    return formData?.attractions.reduce((total, attr) => total + (attr.visitDuration || 0), 0) || 0;
  };

  const calculateTotalPrice = () => {
    return formData?.attractions.reduce((total, attr) => total + (attr.price || 0), 0) || 0;
  };

  if (!formData) return null;

  console.log('RoutePreview rendering with attractions:', attractions);

  return (
    <div className="space-y-4">
      <RouteHeader 
        onBack={onBack}
        onCreateRoute={onContinue}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="h-[400px] relative">
          <CityMap
            center={[formData.city?.lat || 0, formData.city?.lng || 0]}
            attractions={attractions}
            zoom={13}
            showWalkingPath={true}
          />
        </div>
        <RouteCreationSummary
          formData={formData}
          onBack={onBack}
          onCreateRoute={onContinue}
          calculateTotalDuration={calculateTotalDuration}
          calculateTotalPrice={calculateTotalPrice}
        />
      </div>
    </div>
  );
}
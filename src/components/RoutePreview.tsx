import React, { useEffect, useState, useRef } from 'react';
import CityMap from './CityMap';
import { CreateRouteFormData } from '@/types/route';
import { geocodeAddress } from '@/services/geocoding';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { RouteHeader } from './route/RouteHeader';
import { RouteSummary } from './route/RouteSummary';
import { Alert, AlertDescription } from './ui/alert';
import { Info } from 'lucide-react';
import { Button } from './ui/button';

interface RoutePreviewProps {
  formData: CreateRouteFormData;
  onBack: () => void;
  onContinue: () => void;
  screenshotUrl: string | null;
}

export function RoutePreview({ formData, onBack, onContinue, screenshotUrl }: RoutePreviewProps) {
  const [attractions, setAttractions] = useState<Array<{ name: string; position: [number, number] }>>([]);
  const [totalTravelTime, setTotalTravelTime] = useState(0);
  const mapRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const loadAttractionPositions = async () => {
      try {
        const positions = await Promise.all(
          formData.attractions.map(async (attraction) => {
            const searchTerm = attraction.inputType === 'address' 
              ? `${attraction.address}, ${formData.city?.name}, Italia`
              : `${attraction.name}, ${formData.city?.name}, Italia`;
              
            const position = await geocodeAddress(searchTerm);
            console.log(`Geocoded position for ${searchTerm}:`, position);
            
            return {
              name: attraction.name || attraction.address,
              position: position
            };
          })
        );
        
        setAttractions(positions);

        if (positions.length > 1) {
          const travelTimes = await Promise.all(
            positions.slice(0, -1).map(async (start, i) => {
              const end = positions[i + 1];
              const response = await fetch(
                `https://router.project-osrm.org/route/v1/foot/${start.position[1]},${start.position[0]};${end.position[1]},${end.position[0]}?overview=full`
              );
              const data = await response.json();
              return Math.round(data.routes[0].duration / 60);
            })
          );

          const totalTime = travelTimes.reduce((sum, time) => sum + time, 0);
          setTotalTravelTime(formData.transportMode === 'public' ? Math.round(totalTime / 3) : totalTime);
        }
      } catch (error) {
        console.error('Error loading positions:', error);
        toast({
          title: "Errore",
          description: "Impossibile caricare le posizioni di alcune attrazioni",
          variant: "destructive"
        });
      }
    };

    loadAttractionPositions();
  }, [formData, toast]);

  const totalVisitDuration = formData.attractions.reduce((sum, attr) => sum + (attr.visitDuration || 0), 0);
  const totalDuration = totalVisitDuration + totalTravelTime;
  const totalPrice = formData.attractions.reduce((sum, attr) => sum + (attr.price || 0), 0);

  return (
    <div className="space-y-4">
      <RouteHeader
        onBack={onBack}
        onCreateRoute={() => {}}
        screenshotUrl={screenshotUrl}
      />

      <h2 className="text-2xl font-bold">Anteprima Percorso</h2>
      
      <RouteSummary
        totalDuration={totalDuration}
        totalVisitDuration={totalVisitDuration}
        totalTravelTime={totalTravelTime}
        totalPrice={totalPrice}
        transportMode={formData.transportMode}
      />
      
      <div ref={mapRef} className="h-[400px] w-full">
        <CityMap
          center={[formData.city?.lat || 0, formData.city?.lng || 0]}
          attractions={attractions}
          showWalkingPath={true}
        />
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Prima di continuare, crea uno screenshot della mappa che mostri chiaramente il percorso e i punti di interesse.
          Questo aiuterà gli altri utenti a visualizzare meglio il tuo itinerario.
        </AlertDescription>
      </Alert>

      <div className="flex justify-end">
        <Button onClick={onContinue}>
          Continua
        </Button>
      </div>
    </div>
  );
}
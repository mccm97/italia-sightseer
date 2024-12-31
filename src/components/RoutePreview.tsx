import React, { useEffect, useState } from 'react';
import { Button } from './ui/button';
import CityMap from './CityMap';
import { CreateRouteFormData } from '@/types/route';
import { ArrowLeft } from 'lucide-react';
import { geocodeAddress } from '@/services/geocoding';
import { useToast } from '@/hooks/use-toast';
import { createRoute, checkRouteNameExists } from '@/services/routes';

interface RoutePreviewProps {
  formData: CreateRouteFormData;
  onBack: () => void;
  onClose: () => void;
}

export function RoutePreview({ formData, onBack, onClose }: RoutePreviewProps) {
  const [attractions, setAttractions] = useState<Array<{ name: string; position: [number, number] }>>([]);
  const [totalTravelTime, setTotalTravelTime] = useState(0);
  const [isCreating, setIsCreating] = useState(false);
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

  const handleCreateRoute = async () => {
    try {
      setIsCreating(true);
      
      if (!formData.city?.id) {
        throw new Error('City ID is required');
      }

      // Verifica se esiste già un percorso con lo stesso nome
      const exists = await checkRouteNameExists(formData.name, formData.city.id);
      if (exists) {
        toast({
          title: "Errore",
          description: "Esiste già un percorso con questo nome per questa città",
          variant: "destructive"
        });
        return;
      }

      await createRoute(formData);
      
      toast({
        title: "Percorso Creato",
        description: "Il tuo percorso è stato creato con successo!",
      });
      
      onClose();
    } catch (error) {
      console.error('Error creating route:', error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante la creazione del percorso",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <Button 
          variant="outline" 
          onClick={onBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Torna alla creazione
        </Button>
        <Button 
          onClick={handleCreateRoute}
          className="bg-primary text-white"
          disabled={isCreating}
        >
          {isCreating ? 'Creazione in corso...' : 'Crea Percorso'}
        </Button>
      </div>

      <h2 className="text-2xl font-bold">Anteprima Percorso</h2>
      
      <div className="bg-muted p-4 rounded-lg space-y-2">
        <p><strong>Durata totale:</strong> {totalDuration} minuti</p>
        <p><strong>Tempo di visita:</strong> {totalVisitDuration} minuti</p>
        <p><strong>Tempo di spostamento:</strong> {totalTravelTime} minuti</p>
        <p><strong>Costo totale:</strong> €{totalPrice.toFixed(2)}</p>
        <p><strong>Modalità di trasporto:</strong> {formData.transportMode === 'walking' ? 'A piedi' : 'Mezzi pubblici'}</p>
      </div>
      
      <div className="h-[400px] w-full">
        <CityMap
          center={[formData.city?.lat || 0, formData.city?.lng || 0]}
          attractions={attractions}
          showWalkingPath={true}
        />
      </div>
    </div>
  );
}
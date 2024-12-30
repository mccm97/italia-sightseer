import React, { useEffect, useState } from 'react';
import { Button } from './ui/button';
import CityMap from './CityMap';
import { CreateRouteFormData } from '@/types/route';
import { ArrowLeft } from 'lucide-react';
import { geocodeAddress } from '@/services/geocoding';
import { useToast } from '@/hooks/use-toast';

interface RoutePreviewProps {
  formData: CreateRouteFormData;
  onBack: () => void;
}

export function RoutePreview({ formData, onBack }: RoutePreviewProps) {
  const [attractions, setAttractions] = useState<Array<{ name: string; position: [number, number] }>>([]);
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
      </div>

      <h2 className="text-2xl font-bold">Anteprima Percorso</h2>
      
      <div className="h-[400px] w-full">
        <CityMap
          center={[formData.city?.lat || 0, formData.city?.lng || 0]}
          attractions={attractions}
        />
      </div>
    </div>
  );
}
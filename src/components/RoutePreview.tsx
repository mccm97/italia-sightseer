import React from 'react';
import { Button } from './ui/button';
import CityMap from './CityMap';
import { CreateRouteFormData } from '@/types/route';
import { ArrowLeft } from 'lucide-react';

interface RoutePreviewProps {
  formData: CreateRouteFormData;
  onBack: () => void;
}

export function RoutePreview({ formData, onBack }: RoutePreviewProps) {
  const attractions = formData.attractions.map((attraction, index) => ({
    name: attraction.name || attraction.address,
    position: [
      formData.city?.lat + (index * 0.001),
      formData.city?.lng + (index * 0.001)
    ] as [number, number]
  }));

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
import React from 'react';
import { Button } from './ui/button';
import CityMap from './CityMap';
import { CreateRouteFormData } from '@/types/route';

interface RoutePreviewProps {
  formData: CreateRouteFormData;
  onBack: () => void;
}

export function RoutePreview({ formData, onBack }: RoutePreviewProps) {
  // Per ora usiamo coordinate di esempio per le attrazioni
  const attractions = formData.attractions.map((attraction, index) => ({
    name: attraction.name || attraction.address,
    // Queste coordinate sono di esempio e andrebbero recuperate da un servizio di geocoding
    position: [
      formData.city?.lat + (index * 0.001),
      formData.city?.lng + (index * 0.001)
    ] as [number, number]
  }));

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Anteprima Percorso</h2>
      <div className="h-[400px] w-full">
        <CityMap
          center={[formData.city?.lat || 0, formData.city?.lng || 0]}
          attractions={attractions}
        />
      </div>
      <div className="flex justify-start">
        <Button variant="outline" onClick={onBack}>
          Torna indietro
        </Button>
      </div>
    </div>
  );
}
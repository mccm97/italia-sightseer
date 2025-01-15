import { useState } from 'react';
import CityMap from './CityMap';
import { RouteHeader } from './route/RouteHeader';
import { RouteCreationSummary } from './route/RouteCreationSummary';
import { CreateRouteFormData } from '@/types/route';
import { useAttractionCoordinates } from '@/hooks/useAttractionCoordinates';

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
  const attractions = useAttractionCoordinates(formData);

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
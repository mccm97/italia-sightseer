import { CityMap } from './CityMap';
import { RouteHeader } from './route/RouteHeader';
import { CreateRouteFormData } from '@/types/route';

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
  if (!formData) return null;

  return (
    <div className="space-y-4">
      <RouteHeader 
        onBack={onBack}
        onCreateRoute={onContinue}
      />
      <div className="h-[400px] relative">
        <CityMap
          center={[formData.city.lat, formData.city.lng]}
          attractions={formData.attractions.map((attr, index) => ({
            name: attr.name || attr.address,
            position: [0, 0], // You might want to get actual coordinates
            visitDuration: attr.visitDuration,
            price: attr.price
          }))}
          zoom={13}
        />
      </div>
    </div>
  );
}
import CityMap from './CityMap';
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

  console.log('RoutePreview formData:', formData);
  console.log('Attractions with coordinates:', formData.attractions);

  return (
    <div className="space-y-4">
      <RouteHeader 
        onBack={onBack}
        onCreateRoute={onContinue}
      />
      <div className="h-[400px] relative">
        <CityMap
          center={[formData.city.lat, formData.city.lng]}
          attractions={formData.attractions.map(attr => ({
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
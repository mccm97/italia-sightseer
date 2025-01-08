import { Dialog, DialogContent } from '@/components/ui/dialog';
import { RoutePreview } from '@/components/RoutePreview';
import { Route } from '@/types/route';

interface RoutePreviewDialogProps {
  showRoutePreview: boolean;
  setShowRoutePreview: (show: boolean) => void;
  selectedRoute: Route | null;
  selectedCity: any;
  routeSummary: string;
}

export function RoutePreviewDialog({
  showRoutePreview,
  setShowRoutePreview,
  selectedRoute,
  selectedCity,
  routeSummary
}: RoutePreviewDialogProps) {
  if (!selectedRoute) return null;

  return (
    <Dialog open={showRoutePreview} onOpenChange={setShowRoutePreview}>
      <DialogContent className="sm:max-w-[800px]">
        <RoutePreview
          formData={{
            name: selectedRoute.name,
            city: {
              id: selectedCity?.id || 'temp-id',
              name: selectedRoute.cityName,
              lat: selectedRoute.attractions[0]?.position?.[0] || selectedCity?.lat || 0,
              lng: selectedRoute.attractions[0]?.position?.[1] || selectedCity?.lng || 0,
              country: selectedCity?.country
            },
            country: selectedCity?.country || 'Italy',
            attractions: selectedRoute.attractions.map(attr => ({
              name: attr.name,
              address: '',
              inputType: 'name',
              visitDuration: attr.visitDuration,
              price: attr.price || 0
            })),
            attractionsCount: selectedRoute.attractions.length,
            transportMode: 'walking'
          }}
          onBack={() => setShowRoutePreview(false)}
          onContinue={() => {}}
        />
        {routeSummary && (
          <div className="mt-4">
            <h3 className="text-xl font-bold">Riassunto del percorso:</h3>
            <p>{routeSummary}</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
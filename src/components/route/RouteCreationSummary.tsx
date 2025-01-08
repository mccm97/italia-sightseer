import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { CreateRouteFormData } from '@/types/route';
import { ImageUpload } from '../ImageUpload';
import { Alert, AlertDescription } from '../ui/alert';
import { Info } from 'lucide-react';

interface RouteCreationSummaryProps {
  formData: CreateRouteFormData;
  onBack: () => void;
  onCreateRoute: () => void;
  calculateTotalDuration: () => number;
  calculateTotalPrice: () => number;
  onScreenshotUpload: (url: string) => void;
  screenshotUrl: string | null;
}

export function RouteCreationSummary({
  formData,
  onBack,
  onCreateRoute,
  calculateTotalDuration,
  calculateTotalPrice,
  onScreenshotUpload,
  screenshotUrl
}: RouteCreationSummaryProps) {
  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="pt-6 space-y-4">
          <h3 className="font-semibold text-lg">Riepilogo Percorso</h3>
          <p><strong>Nome:</strong> {formData?.name}</p>
          <p><strong>Città:</strong> {formData?.city?.name}</p>
          <p><strong>Durata Totale:</strong> {calculateTotalDuration()} minuti</p>
          <p><strong>Costo Totale:</strong> €{calculateTotalPrice().toFixed(2)}</p>
          <div>
            <h4 className="font-medium">Attrazioni:</h4>
            <ul className="list-disc pl-5 mt-2">
              {formData?.attractions.map((attr, index) => (
                <li key={index}>
                  {attr.name || attr.address} - {attr.visitDuration} min, €{attr.price}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">Screenshot del Percorso</h4>
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Carica lo screenshot della mappa che hai appena creato. 
                Questo aiuterà gli altri utenti a visualizzare meglio il tuo percorso.
              </AlertDescription>
            </Alert>
            <ImageUpload
              onImageUploaded={onScreenshotUpload}
              bucketName="screenshots"
              currentImage={screenshotUrl}
              className="mt-2"
            />
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-between gap-4">
        <Button 
          variant="outline" 
          onClick={onBack}
        >
          Torna alla Mappa
        </Button>
        <Button 
          onClick={onCreateRoute}
          disabled={!screenshotUrl}
        >
          Crea Percorso
        </Button>
      </div>
    </div>
  );
}
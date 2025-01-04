import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { CreateRouteFormData } from '@/types/route';

interface RouteCreationSummaryProps {
  formData: CreateRouteFormData;
  onBack: () => void;
  onPreview: () => void;
  calculateTotalDuration: () => number;
  calculateTotalPrice: () => number;
}

export function RouteCreationSummary({
  formData,
  onBack,
  onPreview,
  calculateTotalDuration,
  calculateTotalPrice
}: RouteCreationSummaryProps) {
  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="pt-6 space-y-2">
          <h3 className="font-semibold text-lg">Riepilogo Percorso</h3>
          <p><strong>Nome:</strong> {formData?.name}</p>
          <p><strong>Città:</strong> {formData?.city?.name}</p>
          <p><strong>Durata Totale:</strong> {calculateTotalDuration()} minuti</p>
          <p><strong>Costo Totale:</strong> €{calculateTotalPrice().toFixed(2)}</p>
          <div className="mt-4">
            <h4 className="font-medium">Attrazioni:</h4>
            <ul className="list-disc pl-5 mt-2">
              {formData?.attractions.map((attr, index) => (
                <li key={index}>
                  {attr.name || attr.address} - {attr.visitDuration} min, €{attr.price}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-between gap-4">
        <Button 
          variant="outline" 
          onClick={onBack}
        >
          Modifica
        </Button>
        <Button onClick={onPreview}>
          Visualizza su Mappa
        </Button>
      </div>
    </div>
  );
}
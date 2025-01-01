import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { CreateRouteFormData } from '@/types/route';

interface RouteFormSummaryProps {
  formData: CreateRouteFormData;
  onBack: () => void;
  onShowPreview: () => void;
}

export function RouteFormSummary({ formData, onBack, onShowPreview }: RouteFormSummaryProps) {
  const calculateTotalDuration = () => {
    return formData.attractions.reduce((total, attr) => total + (attr.visitDuration || 0), 0);
  };

  const calculateTotalPrice = () => {
    return formData.attractions.reduce((total, attr) => total + (attr.price || 0), 0);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="pt-6 space-y-2">
          <h3 className="font-semibold text-lg">Riepilogo Percorso</h3>
          <p><strong>Nome:</strong> {formData.name}</p>
          <p><strong>Città:</strong> {formData.city?.name}</p>
          <p><strong>Durata Totale:</strong> {calculateTotalDuration()} minuti</p>
          <p><strong>Costo Totale:</strong> €{calculateTotalPrice().toFixed(2)}</p>
          <div className="mt-4">
            <h4 className="font-medium">Attrazioni:</h4>
            <ul className="list-disc pl-5 mt-2">
              {formData.attractions.map((attr, index) => (
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
        <Button 
          onClick={onShowPreview}
        >
          Visualizza su Mappa
        </Button>
      </div>
    </div>
  );
}
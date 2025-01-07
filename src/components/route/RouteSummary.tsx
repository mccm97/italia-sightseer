import React from 'react';

interface RouteSummaryProps {
  totalDuration: number;
  totalVisitDuration: number;
  totalTravelTime: number;
  totalPrice: number;
  transportMode: string;
}

export function RouteSummary({ 
  totalDuration, 
  totalVisitDuration, 
  totalTravelTime, 
  totalPrice, 
  transportMode 
}: RouteSummaryProps) {
  return (
    <div className="bg-muted p-4 rounded-lg space-y-2">
      <p><strong>Durata totale:</strong> {totalDuration} minuti</p>
      <p><strong>Tempo di visita:</strong> {totalVisitDuration} minuti</p>
      <p><strong>Tempo di spostamento:</strong> {totalTravelTime} minuti</p>
      <p><strong>Costo totale:</strong> €{totalPrice.toFixed(2)}</p>
      <p><strong>Modalità di trasporto:</strong> {transportMode === 'walking' ? 'A piedi' : 'Mezzi pubblici'}</p>
    </div>
  );
}
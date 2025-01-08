import { CardContent } from '@/components/ui/card';

interface RouteCardContentProps {
  duration: number;
  attractionsCount: number;
  showSummary: boolean;
  summary: string;
  totalCost?: number;
}

export function RouteCardContent({
  duration,
  attractionsCount,
  totalCost = 0,
  showSummary,
  summary
}: RouteCardContentProps) {
  return (
    <div className="space-y-4">
      <div>
        <p>Durata totale: {duration} minuti</p>
        <p>Attrazioni: {attractionsCount}</p>
        <p>Costo totale: €{totalCost}</p>
      </div>
      
      {showSummary && (
        <div className="mt-4 p-4 bg-muted rounded-lg">
          <h3 className="text-sm font-medium mb-2">Descrizione del percorso:</h3>
          <p className="text-sm text-muted-foreground">{summary || "Nessuna descrizione disponibile"}</p>
        </div>
      )}
    </div>
  );
}
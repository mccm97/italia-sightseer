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
    <CardContent>
      <p>Durata totale: {duration} minuti</p>
      <p>Attrazioni: {attractionsCount}</p>
      <p>Costo totale: €{totalCost}</p>
      {showSummary && (
        <div className="mt-4">
          <h3 className="text-xl font-bold">Riassunto del percorso:</h3>
          <p>{summary}</p>
        </div>
      )}
    </CardContent>
  );
}
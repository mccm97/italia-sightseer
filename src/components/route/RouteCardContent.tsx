import { CardContent } from '@/components/ui/card';

interface RouteCardContentProps {
  duration: number;
  attractionsCount: number;
  totalCost: number;
  showSummary: boolean;
  summary: string;
}

export function RouteCardContent({
  duration,
  attractionsCount,
  totalCost,
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
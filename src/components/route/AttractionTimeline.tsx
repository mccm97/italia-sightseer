import { Circle } from 'lucide-react';

interface AttractionTimelineProps {
  attractions: Array<{
    name: string;
    visitDuration?: number;
    price?: number;
  }>;
}

export function AttractionTimeline({ attractions }: AttractionTimelineProps) {
  return (
    <div className="space-y-4 relative">
      <div className="absolute left-2 top-4 bottom-4 w-0.5 bg-primary/20" />
      {attractions?.map((attraction, index) => (
        <div key={index} className="flex items-start gap-4 relative">
          <Circle className="w-4 h-4 text-primary flex-shrink-0 mt-2" />
          <div className="flex-1 p-4 border rounded-lg space-y-2 bg-white">
            <h3 className="font-semibold">{attraction.name}</h3>
            <div className="text-sm text-muted-foreground">
              <p>Durata visita: {attraction.visitDuration || 0} minuti</p>
              {typeof attraction.price === 'number' && (
                <p>Prezzo: €{attraction.price.toFixed(2)}</p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
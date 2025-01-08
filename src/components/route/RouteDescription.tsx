import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '../ui/button';

interface RouteDescriptionProps {
  description: string;
  isExpanded: boolean;
  onToggle: () => void;
}

export function RouteDescription({ description, isExpanded, onToggle }: RouteDescriptionProps) {
  return (
    <div className="space-y-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
        className="flex items-center gap-2"
      >
        <span>Riassunto percorso</span>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )}
      </Button>
      {isExpanded && (
        <div className="p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">{description || "Nessuna descrizione disponibile"}</p>
        </div>
      )}
    </div>
  );
}
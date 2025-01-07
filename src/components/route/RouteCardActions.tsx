import { Button } from '@/components/ui/button';
import { ListTree, ChevronDown } from 'lucide-react';

interface RouteCardActionsProps {
  onDirectionsClick: () => void;
  onAttractionsClick: () => void;
  onSummaryClick: () => void;
}

export function RouteCardActions({
  onDirectionsClick,
  onAttractionsClick,
  onSummaryClick
}: RouteCardActionsProps) {
  return (
    <div className="flex items-center gap-4">
      <Button
        variant="outline"
        size="sm"
        onClick={(e) => {
          e.stopPropagation();
          onDirectionsClick();
        }}
      >
        Visualizza Indicazioni
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={(e) => {
          e.stopPropagation();
          onAttractionsClick();
        }}
      >
        <ListTree className="w-4 h-4 mr-2" />
        Dettagli Attrazioni
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={(e) => {
          e.stopPropagation();
          onSummaryClick();
        }}
      >
        <ChevronDown className="w-4 h-4" />
      </Button>
    </div>
  );
}
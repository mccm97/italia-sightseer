import { Button } from '@/components/ui/button';
import { Map, MessageSquare, ListTree, Star } from 'lucide-react';

interface RouteActionsProps {
  onCommentsClick: () => void;
  onAttractionsClick?: () => void; // Made optional
  onDescriptionToggle: () => void;
  onMapClick: () => void;
  onReviewsClick: () => void;
  showDescription: boolean;
  showMap: boolean;
}

export function RouteActions({
  onCommentsClick,
  onAttractionsClick,
  onDescriptionToggle,
  onMapClick,
  onReviewsClick,
  showDescription,
  showMap
}: RouteActionsProps) {
  return (
    <div className="flex flex-wrap gap-2 mt-4">
      <Button
        variant="outline"
        size="sm"
        onClick={(e) => {
          e.stopPropagation();
          onCommentsClick();
        }}
      >
        <MessageSquare className="w-4 h-4 mr-2" />
        Commenti
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={(e) => {
          e.stopPropagation();
          onReviewsClick();
        }}
      >
        <Star className="w-4 h-4 mr-2" />
        Recensioni
      </Button>

      {onAttractionsClick && (
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
      )}

      <Button
        variant="outline"
        size="sm"
        onClick={(e) => {
          e.stopPropagation();
          onDescriptionToggle();
        }}
      >
        {showDescription ? 'Nascondi Descrizione' : 'Mostra Descrizione'}
      </Button>

      <Button
        variant={showMap ? "default" : "outline"}
        size="sm"
        onClick={(e) => {
          e.stopPropagation();
          onMapClick();
        }}
        className="flex items-center gap-2"
      >
        <Map className="w-4 h-4" />
        {showMap ? 'Nascondi mappa' : 'Visualizza su mappa'}
      </Button>
    </div>
  );
}
import { Button } from '@/components/ui/button';
import { Map, MessageSquare, ListTree, Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface RouteActionsProps {
  onCommentsClick: () => void;
  onAttractionsClick: () => void;
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
  const { t, i18n } = useTranslation();
  const isEnglish = i18n.language === 'en';

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
        {isEnglish ? 'Comments' : 'Commenti'}
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
        {isEnglish ? 'Reviews' : 'Recensioni'}
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
        {isEnglish ? 'Attraction Details' : 'Dettagli Attrazioni'}
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={(e) => {
          e.stopPropagation();
          onDescriptionToggle();
        }}
      >
        {isEnglish 
          ? (showDescription ? 'Hide Description' : 'Show Description')
          : (showDescription ? 'Nascondi Descrizione' : 'Mostra Descrizione')}
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
        {isEnglish 
          ? (showMap ? 'Hide Map' : 'View on Map')
          : (showMap ? 'Nascondi mappa' : 'Visualizza su mappa')}
      </Button>
    </div>
  );
}
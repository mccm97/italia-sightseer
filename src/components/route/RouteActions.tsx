
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
  const { t } = useTranslation();
  
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
        {t('routes.actions.comments')}
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
        {t('routes.actions.reviews')}
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
        {t('routes.actions.attractionDetails')}
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={(e) => {
          e.stopPropagation();
          onDescriptionToggle();
        }}
      >
        {showDescription ? t('routes.actions.hideDescription') : t('routes.actions.showDescription')}
      </Button>

      <Button
        variant={showMap ? "default" : "outline"}
        size="sm"
        onClick={(e) => {
          e.stopPropagation();
          onMapClick();
        }}
      >
        <Map className="w-4 h-4 mr-2" />
        {showMap ? t('routes.actions.hideMap') : t('routes.actions.showMap')}
      </Button>
    </div>
  );
}

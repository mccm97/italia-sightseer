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
        {t('routes.comments')}
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
        {t('routes.reviews')}
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
        {t('routes.attractionDetails')}
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={(e) => {
          e.stopPropagation();
          onDescriptionToggle();
        }}
      >
        {showDescription ? t('routes.hideDescription') : t('routes.showDescription')}
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
        {showMap ? t('routes.hideMap') : t('routes.showMap')}
      </Button>
    </div>
  );
}
import React from 'react';
import { Button } from '../ui/button';
import { MessageSquare, ListTree } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface RouteCardActionsProps {
  onCommentsClick: () => void;
  onAttractionsClick: () => void;
  onDescriptionToggle: () => void;
  showDescription: boolean;
}

export function RouteCardActions({
  onCommentsClick,
  onAttractionsClick,
  onDescriptionToggle,
  showDescription
}: RouteCardActionsProps) {
  const { t, i18n } = useTranslation();
  const isEnglish = i18n.language === 'en';

  return (
    <div className="flex justify-end gap-2 mt-4">
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
    </div>
  );
}
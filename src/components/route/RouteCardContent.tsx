import { CardContent } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
  
  return (
    <CardContent className="space-y-4">
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">
          {t('routes.duration')}: {duration} {t('routes.minutes')}
        </p>
        <p className="text-sm text-muted-foreground">
          {t('routes.attractions')}: {attractionsCount}
        </p>
        <p className="text-sm text-muted-foreground">
          {t('routes.totalCost')}: €{totalCost.toFixed(2)}
        </p>
      </div>
      
      {showSummary && summary && (
        <div className="mt-4 p-4 bg-muted rounded-lg">
          <h3 className="text-sm font-medium mb-2">{t('routes.description')}:</h3>
          <p className="text-sm text-muted-foreground">{summary}</p>
        </div>
      )}
    </CardContent>
  );
}
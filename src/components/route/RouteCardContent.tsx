
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
    <div className="space-y-4">
      <div>
        <p>{t('routes.summary.totalDuration')}: {duration} {t('routes.attractions.minutes')}</p>
        <p>{t('routes.summary.attractions')}: {attractionsCount}</p>
        <p>{t('routes.summary.totalCost')}: €{totalCost}</p>
      </div>
      
      {showSummary && (
        <div className="mt-4 p-4 bg-muted rounded-lg">
          <h3 className="text-sm font-medium mb-2">{t('routes.basicInfo.routeDescription')}:</h3>
          <p className="text-sm text-muted-foreground">{summary || t('common.noDescription')}</p>
        </div>
      )}
    </div>
  );
}

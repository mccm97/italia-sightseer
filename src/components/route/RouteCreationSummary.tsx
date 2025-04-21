
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { CreateRouteFormData } from '@/types/route';
import { useTranslation } from 'react-i18next';

interface RouteCreationSummaryProps {
  formData: CreateRouteFormData;
  onBack: () => void;
  onCreateRoute: () => void;
  calculateTotalDuration: () => number;
  calculateTotalPrice: () => number;
}

export function RouteCreationSummary({
  formData,
  onBack,
  onCreateRoute,
  calculateTotalDuration,
  calculateTotalPrice,
}: RouteCreationSummaryProps) {
  const { t } = useTranslation();
  
  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="pt-6 space-y-4">
          <h3 className="font-semibold text-lg">{t('routes.summary.title')}</h3>
          <p><strong>{t('routes.summary.name')}:</strong> {formData?.name}</p>
          <p><strong>{t('routes.summary.city')}:</strong> {formData?.city?.name}</p>
          <p><strong>{t('routes.summary.totalDuration')}:</strong> {calculateTotalDuration()} {t('routes.attractions.minutes')}</p>
          <p><strong>{t('routes.summary.totalCost')}:</strong> €{calculateTotalPrice().toFixed(2)}</p>
          <div>
            <h4 className="font-medium">{t('routes.summary.attractions')}:</h4>
            <ul className="list-disc pl-5 mt-2">
              {formData?.attractions.map((attr, index) => (
                <li key={index}>
                  {attr.name || attr.address} - {attr.visitDuration} {t('routes.attractions.minutes')}, €{attr.price}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-between gap-4">
        <Button 
          variant="outline" 
          onClick={onBack}
        >
          {t('routes.summary.backToMap')}
        </Button>
        <Button 
          onClick={onCreateRoute}
        >
          {t('routes.summary.createRoute')}
        </Button>
      </div>
    </div>
  );
}

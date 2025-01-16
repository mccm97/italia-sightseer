import { useTranslation } from 'react-i18next';
import { MapPin, Clock, Euro } from 'lucide-react';

interface AttractionTimelineProps {
  attractions: Array<{
    name: string;
    visitDuration?: number;
    price?: number;
    position?: [number, number];
  }>;
}

export function AttractionTimeline({ attractions }: AttractionTimelineProps) {
  const { t } = useTranslation();
  console.log('AttractionTimeline - received attractions:', attractions);

  return (
    <div className="space-y-8">
      {attractions.map((attraction, index) => (
        <div key={index} className="flex items-start">
          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-primary">
            {index + 1}
          </div>
          <div className="ml-4 flex-1">
            <h4 className="text-lg font-semibold">{attraction.name}</h4>
            <div className="mt-2 space-y-2">
              {attraction.visitDuration && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="mr-2 h-4 w-4" />
                  {t('routes.visitDuration', { duration: attraction.visitDuration })}
                </div>
              )}
              {attraction.price !== undefined && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <Euro className="mr-2 h-4 w-4" />
                  {t('routes.price', { price: attraction.price })}
                </div>
              )}
              {attraction.position && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="mr-2 h-4 w-4" />
                  {t('routes.coordinates', { 
                    lat: attraction.position[0].toFixed(4), 
                    lng: attraction.position[1].toFixed(4) 
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
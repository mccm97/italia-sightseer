import { Card, CardContent } from '@/components/ui/card';
import { RouteScreenshot } from './RouteScreenshot';

interface RouteCardMediaProps {
  routeId: string;
  imageUrl?: string;
}

export function RouteCardMedia({ routeId, imageUrl }: RouteCardMediaProps) {
  return (
    <Card>
      <CardContent className="p-0">
        <div className="relative aspect-[16/9] overflow-hidden rounded-t-lg">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt="Route preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <RouteScreenshot routeId={routeId} />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
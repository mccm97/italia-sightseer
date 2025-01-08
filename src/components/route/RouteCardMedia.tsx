import { RouteScreenshot } from '../RouteScreenshot';
import { Card, CardContent } from '../ui/card';

interface RouteCardMediaProps {
  routeId: string;
  routeName?: string;
}

export function RouteCardMedia({ routeId }: RouteCardMediaProps) {
  return (
    <Card>
      <CardContent className="p-0">
        <div className="relative aspect-[16/9] overflow-hidden rounded-t-lg">
          <RouteScreenshot routeId={routeId} />
        </div>
      </CardContent>
    </Card>
  );
}
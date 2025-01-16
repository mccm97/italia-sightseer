import { RouteOff } from 'lucide-react';
import { RouteCard } from '../route/RouteCard';
import { DeleteRouteButton } from './DeleteRouteButton';
import { DbRoute } from './types';
import { useTranslation } from 'react-i18next';

interface RouteListProps {
  routes: DbRoute[];
  currentUserId: string | null;
  onRouteDelete: () => void;
}

export function RouteList({ routes, currentUserId, onRouteDelete }: RouteListProps) {
  const { t } = useTranslation();

  if (!routes.length) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <RouteOff className="mx-auto h-12 w-12 mb-4" />
        <p>{t('profile.noRoutes')}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {routes.map((route) => {
        const likesCount = route.route_likes?.length || 0;
        const ratings = route.route_ratings || [];
        const averageRating = ratings.length > 0
          ? ratings.reduce((acc, curr) => acc + curr.rating, 0) / ratings.length
          : 0;

        console.log('Processing route attractions for route:', route.id);
        const attractions = route.route_attractions?.map(ra => {
          console.log('Processing attraction:', ra.attraction);
          if (!ra.attraction || typeof ra.attraction.lat !== 'number' || typeof ra.attraction.lng !== 'number') {
            console.warn('Invalid attraction data:', ra.attraction);
            return null;
          }
          return {
            name: ra.attraction.name,
            visitDuration: ra.attraction.visit_duration,
            price: ra.attraction.price || 0,
            position: [ra.attraction.lat, ra.attraction.lng] as [number, number]
          };
        }).filter(Boolean) || [];

        console.log('Transformed attractions:', attractions);

        return (
          <div key={route.id} className="relative">
            <RouteCard
              route={{
                id: route.id,
                name: route.name,
                total_duration: route.total_duration,
                attractions,
                image_url: route.image_url,
                description: route.description,
                city_id: route.city_id,
                creator: {
                  id: route.creator.id,
                  username: route.creator.username,
                  avatar_url: route.creator.avatar_url
                }
              }}
              routeStats={{
                likesCount,
                averageRating
              }}
              onRouteClick={() => {}}
            />
            {route.creator.id === currentUserId && (
              <div className="absolute top-2 right-2">
                <DeleteRouteButton routeId={route.id} onDelete={onRouteDelete} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
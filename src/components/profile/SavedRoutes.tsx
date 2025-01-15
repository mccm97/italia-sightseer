import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { RouteOff } from 'lucide-react';
import { RouteCard } from '../route/RouteCard';
import { useTranslation } from 'react-i18next';

interface SavedRoutesProps {
  userId?: string;
}

export function SavedRoutes({ userId }: SavedRoutesProps) {
  const { t } = useTranslation();

  const { data: savedRoutes, isLoading } = useQuery({
    queryKey: ['savedRoutes', userId],
    queryFn: async () => {
      console.log('Fetching saved routes for user:', userId);
      
      if (!userId) {
        console.warn('No userId provided to SavedRoutes');
        return [];
      }

      const { data: savedRoutes, error } = await supabase
        .from('saved_routes')
        .select(`
          route_id,
          routes (
            *,
            cities(name),
            route_likes(count),
            route_ratings(rating),
            route_attractions(
              *,
              attraction:attractions(*)
            ),
            creator:profiles!routes_user_id_fkey(id, username, avatar_url)
          )
        `)
        .eq('user_id', userId);

      if (error) {
        console.error('Error fetching saved routes:', error);
        throw error;
      }

      return savedRoutes.map(sr => sr.routes);
    },
  });

  if (isLoading) return <div>{t('common.loading')}</div>;

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">{t('profile.savedRoutes')}</h2>
      {savedRoutes && savedRoutes.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {savedRoutes.map((route) => {
            const likesCount = route.route_likes?.length || 0;
            const ratings = route.route_ratings || [];
            const averageRating = ratings.length > 0
              ? ratings.reduce((acc, curr) => acc + curr.rating, 0) / ratings.length
              : 0;

            const attractions = route.route_attractions?.map(ra => ({
              name: ra.attraction.name,
              visitDuration: ra.attraction.visit_duration,
              price: ra.attraction.price,
              position: [ra.attraction.lat, ra.attraction.lng] as [number, number]
            })) || [];

            return (
              <RouteCard
                key={route.id}
                route={{
                  ...route,
                  attractions,
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
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <RouteOff className="mx-auto h-12 w-12 mb-4" />
          <p>{t('profile.noSavedRoutes')}</p>
        </div>
      )}
    </div>
  );
}
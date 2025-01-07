import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { Route, RouteOff } from 'lucide-react';
import { Tables } from '@/integrations/supabase/types';
import { DeleteRouteButton } from './DeleteRouteButton';
import { RouteCard } from '../route/RouteCard';

type DbRoute = Tables<'routes'>;

export function UserRoutes() {
  const { data: routes, isLoading, refetch } = useQuery({
    queryKey: ['userRoutes'],
    queryFn: async () => {
      console.log('Fetching user routes...');
      const { data: routes, error } = await supabase
        .from('routes')
        .select(`
          *,
          cities(name),
          route_likes(count),
          route_ratings(rating)
        `)
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id);

      if (error) {
        console.error('Error fetching user routes:', error);
        throw error;
      }

      console.log('User routes fetched:', routes);
      return routes as (DbRoute & { 
        cities: { name: string },
        route_likes: { count: number }[],
        route_ratings: { rating: number }[]
      })[];
    },
  });

  if (isLoading) return <div>Caricamento percorsi...</div>;

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">I miei percorsi</h2>
      {routes && routes.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {routes.map((route) => {
            const likesCount = route.route_likes?.length || 0;
            const ratings = route.route_ratings || [];
            const averageRating = ratings.length > 0
              ? ratings.reduce((acc, curr) => acc + curr.rating, 0) / ratings.length
              : 0;

            return (
              <div key={route.id} className="relative">
                <RouteCard
                  route={{
                    ...route,
                    attractions: [],
                    creator: { username: 'Tu' }
                  }}
                  routeStats={{
                    likesCount,
                    averageRating
                  }}
                  onRouteClick={() => {}}
                  onDirectionsClick={() => {}}
                />
                <div className="absolute top-2 right-2">
                  <DeleteRouteButton routeId={route.id} onDelete={() => refetch()} />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <RouteOff className="mx-auto h-12 w-12 mb-4" />
          <p>Non hai ancora creato alcun percorso</p>
        </div>
      )}
    </div>
  );
}
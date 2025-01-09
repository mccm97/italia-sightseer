import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { RouteOff } from 'lucide-react';
import { Tables } from '@/integrations/supabase/types';
import { DeleteRouteButton } from './DeleteRouteButton';
import { RouteCard } from '../route/RouteCard';

type DbRoute = Tables<'routes'> & {
  cities: { name: string; lat: number; lng: number; };
  route_likes: { count: number; }[];
  route_ratings: { rating: number; }[];
  route_attractions: {
    attraction: {
      name: string;
      visit_duration: number;
      price: number;
      lat: number;
      lng: number;
    };
  }[];
  creator: {
    id: string;
    username: string;
    avatar_url: string;
  }[];
};

export function UserRoutes() {
  const { data: routes, isLoading, refetch } = useQuery({
    queryKey: ['userRoutes'],
    queryFn: async () => {
      console.log('Fetching user routes...');
      const { data: routes, error } = await supabase
        .from('routes')
        .select(`
          *,
          cities(name, lat, lng),
          route_likes(count),
          route_ratings(rating),
          route_attractions(
            *,
            attraction:attractions(
              name,
              visit_duration,
              price,
              lat,
              lng
            )
          ),
          creator:profiles(id, username, avatar_url)
        `)
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id);

      if (error) {
        console.error('Error fetching user routes:', error);
        throw error;
      }

      console.log('User routes fetched:', routes);
      return routes as unknown as DbRoute[];
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

            const attractions = route.route_attractions?.map(ra => ({
              name: ra.attraction.name,
              visitDuration: ra.attraction.visit_duration,
              price: ra.attraction.price,
              position: [ra.attraction.lat, ra.attraction.lng] as [number, number]
            })) || [];

            const creator = route.creator?.[0];

            return (
              <div key={route.id} className="relative">
                <RouteCard
                  route={{
                    ...route,
                    attractions,
                    creator: creator ? {
                      id: creator.id,
                      username: creator.username,
                      avatar_url: creator.avatar_url
                    } : undefined
                  }}
                  routeStats={{
                    likesCount,
                    averageRating
                  }}
                  onRouteClick={() => {}}
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
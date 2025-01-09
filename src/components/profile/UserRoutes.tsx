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
  };
};

interface UserRoutesProps {
  userId?: string;
}

export function UserRoutes({ userId }: UserRoutesProps) {
  const { data: routes, isLoading, refetch } = useQuery({
    queryKey: ['userRoutes', userId],
    queryFn: async () => {
      console.log('Fetching routes for user:', userId);
      
      if (!userId) {
        console.warn('No userId provided to UserRoutes');
        return [];
      }

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
          creator:profiles!routes_user_id_fkey(id, username, avatar_url)
        `)
        .eq('user_id', userId);

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
      <h2 className="text-xl font-semibold mb-4">I percorsi</h2>
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

            return (
              <div key={route.id} className="relative">
                <RouteCard
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
                {route.creator.id === (supabase.auth.getUser().then(({ data }) => data.user?.id)) && (
                  <div className="absolute top-2 right-2">
                    <DeleteRouteButton routeId={route.id} onDelete={() => refetch()} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <RouteOff className="mx-auto h-12 w-12 mb-4" />
          <p>Nessun percorso trovato</p>
        </div>
      )}
    </div>
  );
}
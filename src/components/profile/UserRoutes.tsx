import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { RouteOff } from 'lucide-react';
import { Tables } from '@/integrations/supabase/types';
import { DeleteRouteButton } from './DeleteRouteButton';
import { RouteCard } from '../route/RouteCard';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

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
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUserId(user?.id || null);
    };
    getCurrentUser();
  }, []);

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

  if (isLoading) return <div>{t('common.loading')}</div>;

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">{t('profile.routes')}</h2>
      {routes && routes.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {routes.map((route) => {
            const likesCount = route.route_likes?.length || 0;
            const ratings = route.route_ratings || [];
            const averageRating = ratings.length > 0
              ? ratings.reduce((acc, curr) => acc + curr.rating, 0) / ratings.length
              : 0;

            console.log('Processing route attractions:', route.route_attractions);
            const attractions = route.route_attractions?.map(ra => ({
              name: ra.attraction.name,
              visitDuration: ra.attraction.visit_duration,
              price: ra.attraction.price || 0,
              position: [ra.attraction.lat, ra.attraction.lng] as [number, number]
            })) || [];
            console.log('Transformed attractions:', attractions);

            return (
              <div key={route.id} className="relative">
                <RouteCard
                  route={{
                    id: route.id,
                    name: route.name,
                    cityName: route.cities?.name || '',
                    duration: route.total_duration,
                    total_duration: route.total_duration,
                    attractions,
                    isPublic: route.is_public || false,
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
          <p>{t('profile.noRoutes')}</p>
        </div>
      )}
    </div>
  );
}
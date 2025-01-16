import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { DbRoute } from '../types';

export function useRouteData(userId?: string) {
  return useQuery({
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
              id,
              name,
              visit_duration,
              price,
              lat,
              lng
            )
          ),
          creator:profiles!routes_user_id_fkey(id, username, avatar_url)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching user routes:', error);
        throw error;
      }

      console.log('Raw routes data:', routes);
      
      // Log each route's attractions for debugging
      routes?.forEach(route => {
        console.log(`Route ${route.id} attractions:`, route.route_attractions);
        if (route.route_attractions?.length === 0) {
          console.warn(`Route ${route.id} has no attractions - checking route_attractions table directly`);
          // Double check route_attractions table
          supabase
            .from('route_attractions')
            .select('*')
            .eq('route_id', route.id)
            .then(({ data, error }) => {
              if (error) {
                console.error('Error checking route_attractions:', error);
              } else {
                console.log(`Direct route_attractions query for route ${route.id}:`, data);
              }
            });
        }
      });

      return routes as DbRoute[];
    },
    enabled: !!userId
  });
}
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

      // First, let's check what routes exist for this user
      const { data: routeIds, error: routeError } = await supabase
        .from('routes')
        .select('id')
        .eq('user_id', userId);

      if (routeError) {
        console.error('Error fetching route IDs:', routeError);
        throw routeError;
      }

      console.log('Found routes with IDs:', routeIds);

      // Now let's get the full route data with attractions
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
      
      // Check route_attractions separately for each route
      for (const route of routes || []) {
        console.log(`Checking attractions for route ${route.id}:`);
        console.log('- route_attractions from join:', route.route_attractions);
        
        // Double check route_attractions table directly
        const { data: directAttractions, error: attractionsError } = await supabase
          .from('route_attractions')
          .select(`
            *,
            attraction:attractions(*)
          `)
          .eq('route_id', route.id);

        if (attractionsError) {
          console.error(`Error checking route_attractions for route ${route.id}:`, attractionsError);
        } else {
          console.log(`- Direct route_attractions query for route ${route.id}:`, directAttractions);
          
          if (directAttractions?.length !== route.route_attractions?.length) {
            console.warn(`Mismatch in attractions count for route ${route.id}:`, {
              joinedCount: route.route_attractions?.length || 0,
              directCount: directAttractions?.length || 0
            });
          }
        }
      }

      return routes as DbRoute[];
    },
    enabled: !!userId
  });
}
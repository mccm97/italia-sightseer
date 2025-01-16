import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RouteList } from './RouteList';

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

      console.log('Raw routes data:', routes);
      return routes;
    },
  });

  if (isLoading) return <div>{t('common.loading')}</div>;

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">{t('profile.routes')}</h2>
      <RouteList 
        routes={routes || []} 
        currentUserId={currentUserId} 
        onRouteDelete={() => refetch()} 
      />
    </div>
  );
}
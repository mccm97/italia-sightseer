import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { Route, RouteOff } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Tables } from '@/integrations/supabase/types';
import { DeleteRouteButton } from './DeleteRouteButton';

type DbRoute = Tables<'routes'>;

export function UserRoutes() {
  const { data: routes, isLoading, refetch } = useQuery({
    queryKey: ['userRoutes'],
    queryFn: async () => {
      const { data: routes, error } = await supabase
        .from('routes')
        .select('*, cities(name)')
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id);

      if (error) throw error;
      return routes as (DbRoute & { cities: { name: string } })[];
    },
  });

  if (isLoading) return <div>Caricamento percorsi...</div>;

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">I miei percorsi</h2>
      {routes && routes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {routes.map((route) => (
            <div key={route.id} className="relative">
              <Link
                to={`/routes/${route.id}`}
                className="p-4 border rounded-lg hover:bg-accent transition-colors block"
              >
                <Route className="mb-2 h-5 w-5" />
                <h3 className="font-medium">{route.name}</h3>
                <p className="text-sm text-muted-foreground">{route.cities.name}</p>
                <img src={`https://your-supabase-url/storage/v1/object/public/screenshots/${route.id}.png`} alt={`Screenshot del percorso ${route.name}`} />
              </Link>
              <div className="absolute top-2 right-2">
                <DeleteRouteButton routeId={route.id} onDelete={() => refetch()} />
              </div>
            </div>
          ))}
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

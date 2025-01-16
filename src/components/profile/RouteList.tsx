import { DbRoute } from './types';
import { RouteListItem } from './RouteListItem';

interface RouteListProps {
  routes: DbRoute[];
  currentUserId: string | null;
  onRouteDelete: () => void;
}

export function RouteList({ routes, currentUserId, onRouteDelete }: RouteListProps) {
  if (!routes.length) {
    return <div className="text-center text-muted-foreground">No routes created yet</div>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {routes.map(route => (
        <RouteListItem
          key={route.id}
          route={route}
          currentUserId={currentUserId}
          onRouteDelete={onRouteDelete}
        />
      ))}
    </div>
  );
}
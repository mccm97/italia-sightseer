import { DbRoute } from './types';
import { RouteCard } from '@/components/route/RouteCard';

interface RouteListItemProps {
  route: DbRoute;
  currentUserId: string | null;
  onRouteDelete: () => void;
}

export function RouteListItem({ route, currentUserId, onRouteDelete }: RouteListItemProps) {
  const transformedAttractions = route.route_attractions?.map(ra => ({
    name: ra.attraction.name,
    visitDuration: ra.attraction.visit_duration,
    price: ra.attraction.price || 0,
    position: [ra.attraction.lat, ra.attraction.lng] as [number, number]
  })) || [];

  console.log(`Processing route attractions for route: ${route.id}`);
  console.log('Transformed attractions:', transformedAttractions);

  return (
    <RouteCard
      key={route.id}
      route={{
        id: route.id,
        name: route.name,
        creator: route.creator,
        total_duration: route.total_duration,
        attractions: transformedAttractions,
        image_url: route.image_url,
        description: route.description,
        city_id: route.city_id
      }}
      currentUserId={currentUserId}
      onRouteDelete={onRouteDelete}
      showDeleteButton={route.creator?.id === currentUserId}
    />
  );
}
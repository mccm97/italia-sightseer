import { DbRoute } from './types';
import { RouteCard } from '@/components/route/RouteCard';

interface RouteListItemProps {
  route: DbRoute;
  currentUserId: string | null;
  onRouteDelete: () => void;
}

export function RouteListItem({ route, currentUserId, onRouteDelete }: RouteListItemProps) {
  const transformedAttractions = route.route_attractions?.map(ra => {
    console.log('Processing attraction:', ra.attraction);
    return {
      name: ra.attraction.name,
      visitDuration: ra.attraction.visit_duration,
      price: ra.attraction.price || 0,
      position: [
        Number(ra.attraction.lat),
        Number(ra.attraction.lng)
      ] as [number, number]
    };
  }) || [];

  console.log(`Route ${route.id} transformed attractions:`, transformedAttractions);

  return (
    <RouteCard
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
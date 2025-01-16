import { DbRoute } from './types';
import { RouteCard } from '@/components/route/RouteCard';

interface RouteListItemProps {
  route: DbRoute;
  currentUserId: string | null;
  onRouteDelete: () => void;
}

export function RouteListItem({ route, currentUserId, onRouteDelete }: RouteListItemProps) {
  console.log(`Processing route ${route.id} with raw attractions:`, route.route_attractions);
  
  const transformedAttractions = route.route_attractions?.map(ra => {
    if (!ra.attraction) {
      console.warn(`Missing attraction data for route_attraction entry in route ${route.id}:`, ra);
      return null;
    }
    
    console.log('Processing attraction:', ra.attraction);
    
    const position: [number, number] = [
      Number(ra.attraction.lat),
      Number(ra.attraction.lng)
    ];
    
    if (isNaN(position[0]) || isNaN(position[1])) {
      console.warn(`Invalid coordinates for attraction in route ${route.id}:`, ra.attraction);
      return null;
    }
    
    return {
      name: ra.attraction.name,
      visitDuration: ra.attraction.visit_duration,
      price: ra.attraction.price || 0,
      position
    };
  })
  .filter(Boolean) || [];

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
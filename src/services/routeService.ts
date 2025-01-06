import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types";
import { CreateRouteFormData } from "@/types/route";

export async function checkExistingRoute(userId: string, routeName: string) {
  const { data: existingRoutes, error: checkError } = await supabase
    .from('routes')
    .select('id')
    .eq('user_id', userId)
    .eq('name', routeName);

  if (checkError) {
    console.error('Error checking existing routes:', checkError);
    throw new Error('Failed to check existing routes');
  }

  return existingRoutes && existingRoutes.length > 0;
}

export async function createNewRoute(formData: CreateRouteFormData, userId: string, directions: Json) {
  console.log('Creating new route:', { formData, userId });
  
  const { data: route, error: routeError } = await supabase
    .from('routes')
    .insert({
      name: formData.name,
      city_id: formData.city?.id,
      user_id: userId,
      transport_mode: formData.transportMode || 'walking',
      total_duration: calculateTotalDuration(formData),
      total_distance: 0,
      country: formData.country,
      is_public: true,
      directions: directions
    })
    .select()
    .single();

  if (routeError) {
    console.error('Error creating route:', routeError);
    throw new Error('Failed to create route');
  }

  return route;
}

export async function createAttractions(formData: CreateRouteFormData, routeId: string, cityId: string | undefined) {
  for (const [index, attr] of formData.attractions.entries()) {
    const { data: attraction, error: attractionError } = await supabase
      .from('attractions')
      .insert({
        name: attr.name || attr.address,
        lat: 0,
        lng: 0,
        visit_duration: attr.visitDuration,
        price: attr.price,
        city_id: cityId
      })
      .select()
      .single();

    if (attractionError) {
      console.error('Error creating attraction:', attractionError);
      throw new Error('Failed to create attraction');
    }

    const { error: linkError } = await supabase
      .from('route_attractions')
      .insert({
        route_id: routeId,
        attraction_id: attraction.id,
        order_index: index,
        transport_mode: formData.transportMode || 'walking',
        travel_duration: 0,
        travel_distance: 0
      });

    if (linkError) {
      console.error('Error linking attraction to route:', linkError);
      throw new Error('Failed to link attraction to route');
    }
  }
}

function calculateTotalDuration(formData: CreateRouteFormData): number {
  return formData.attractions.reduce((total, attr) => total + (attr.visitDuration || 0), 0);
}
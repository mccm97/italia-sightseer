import { supabase } from "@/integrations/supabase/client";
import { CreateRouteFormData } from "@/types/route";

export async function checkRouteNameExists(name: string, cityId: string) {
  const { data } = await supabase
    .from('routes')
    .select('id')
    .eq('name', name)
    .eq('city_id', cityId)
    .single();
  
  return !!data;
}

export async function createRoute(formData: CreateRouteFormData) {
  console.log('Creating route with data:', formData);
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User must be logged in to create routes');
  }

  // 1. First, ensure the city exists or create it
  const { data: cityData, error: cityError } = await supabase
    .from('cities')
    .upsert({
      name: formData.city.name,
      lat: formData.city.lat,
      lng: formData.city.lng
    })
    .select()
    .single();

  if (cityError) {
    console.error('Error creating/finding city:', cityError);
    throw cityError;
  }

  // 2. Create attractions
  const attractionsPromises = formData.attractions.map(async (attr) => {
    const { data: attrData, error: attrError } = await supabase
      .from('attractions')
      .upsert({
        name: attr.name || attr.address,
        lat: 0, // These will be updated later
        lng: 0,
        visit_duration: attr.visitDuration,
        price: attr.price
      })
      .select()
      .single();

    if (attrError) {
      console.error('Error creating attraction:', attrError);
      throw attrError;
    }

    return attrData;
  });

  const attractions = await Promise.all(attractionsPromises);

  // 3. Create the route
  const { data: routeData, error: routeError } = await supabase
    .from('routes')
    .insert({
      name: formData.name,
      city_id: cityData.id,
      user_id: user.id,
      transport_mode: formData.transportMode,
      total_duration: formData.attractions.reduce((sum, attr) => sum + (attr.visitDuration || 0), 0),
      total_distance: 0, // This will be calculated later
      is_public: true
    })
    .select()
    .single();

  if (routeError) {
    console.error('Error creating route:', routeError);
    throw routeError;
  }

  // 4. Create route_attractions connections
  const routeAttractionsPromises = attractions.map(async (attr, index) => {
    const { error: raError } = await supabase
      .from('route_attractions')
      .insert({
        route_id: routeData.id,
        attraction_id: attr.id,
        order_index: index,
        transport_mode: formData.transportMode,
        travel_duration: 0, // This will be calculated later
        travel_distance: 0
      });

    if (raError) {
      console.error('Error creating route_attraction:', raError);
      throw raError;
    }
  });

  await Promise.all(routeAttractionsPromises);

  return routeData;
}
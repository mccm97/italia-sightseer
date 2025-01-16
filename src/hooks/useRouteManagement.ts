import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Route, Attraction, DirectionsStep } from '@/types/route';
import { generateSummary } from '@/services/summarization';
import { useQuery } from '@tanstack/react-query';

export function useRouteManagement(selectedCity: any, toast: any) {
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [showRoutePreview, setShowRoutePreview] = useState(false);
  const [routeSummary, setRouteSummary] = useState<string>('');

  const fetchCityRoutes = useCallback(async () => {
    if (!selectedCity?.id) return [];

    console.log('Fetching routes for city:', selectedCity.id);
    
    const { data: routes, error } = await supabase
      .from('routes')
      .select(`
        *,
        route_attractions!inner (
          *,
          attraction:attractions (
            id,
            name,
            lat,
            lng,
            visit_duration,
            price
          )
        ),
        creator:profiles!routes_user_id_fkey (
          id,
          username,
          avatar_url
        )
      `)
      .eq('city_id', selectedCity.id);

    if (error) {
      console.error('Error fetching routes:', error);
      toast({
        title: "Errore",
        description: "Impossibile caricare i percorsi per questa città",
        variant: "destructive"
      });
      throw error;
    }

    console.log('Raw routes data:', routes);

    return routes?.map(route => {
      const transformedAttractions: Attraction[] = route.route_attractions?.map((ra: any) => ({
        name: ra.attraction.name,
        visitDuration: ra.attraction.visit_duration,
        price: ra.attraction.price || 0,
        position: [
          Number(ra.attraction.lat),
          Number(ra.attraction.lng)
        ]
      })) || [];

      console.log('Transformed attractions for route:', route.id, transformedAttractions);

      const totalDuration = route.total_duration;

      let parsedDirections: DirectionsStep[] = [];
      if (route.directions) {
        try {
          const directionsData = typeof route.directions === 'string' 
            ? JSON.parse(route.directions) 
            : route.directions;
            
          if (Array.isArray(directionsData)) {
            parsedDirections = directionsData.map(step => ({
              instruction: String(step.instruction || ''),
              distance: Number(step.distance || 0),
              duration: Number(step.duration || 0)
            }));
          }
        } catch (error) {
          console.error('Error parsing directions:', error);
        }
      }

      return {
        id: route.id,
        cityName: selectedCity.name,
        name: route.name,
        duration: totalDuration,
        total_duration: totalDuration,
        creator: route.creator ? {
          id: route.creator.id,
          username: route.creator.username,
          avatar_url: route.creator.avatar_url
        } : undefined,
        attractions: transformedAttractions,
        isPublic: Boolean(route.is_public),
        directions: parsedDirections,
        description: route.description,
        image_url: route.image_url,
        city_id: route.city_id
      } satisfies Route;
    }) || [];
  }, [selectedCity, toast]);

  const { data: cityRoutes = [], isLoading: isLoadingRoutes, error } = useQuery({
    queryKey: ['cityRoutes', selectedCity?.id],
    queryFn: fetchCityRoutes,
    enabled: !!selectedCity?.id,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1
  });

  const handleRouteClick = useCallback(async (route: Route) => {
    console.log('Route clicked:', route);
    setSelectedRoute(route);
    setShowRoutePreview(true);
    
    try {
      const summary = await generateSummary(route.attractions);
      setRouteSummary(summary);
    } catch (error) {
      console.error('Error generating summary:', error);
      toast({
        title: "Errore",
        description: "Impossibile generare il riassunto del percorso",
        variant: "destructive"
      });
    }
  }, [toast]);

  return {
    selectedRoute,
    showRoutePreview,
    setShowRoutePreview,
    cityRoutes,
    isLoadingRoutes,
    routeSummary,
    handleRouteClick
  };
}
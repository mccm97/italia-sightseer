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
        route_attractions (
          *,
          attraction: attractions (*)
        ),
        creator:profiles (username)
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

    console.log('Routes fetched:', routes?.length || 0, 'routes found');

    // Transform the data to match the Route type with proper type checking
    return routes?.map(route => {
      const transformedAttractions: Attraction[] = route.route_attractions?.map((ra: any) => {
        // Ensure position is always a tuple of [number, number]
        const position: [number, number] = [
          Number(ra.attraction.lat) || 0,
          Number(ra.attraction.lng) || 0
        ];

        return {
          name: String(ra.attraction.name),
          position,
          visitDuration: Number(ra.attraction.visit_duration),
          price: Number(ra.attraction.price) || 0
        };
      }) || [];

      // Parse directions from JSON to DirectionsStep[]
      let parsedDirections: DirectionsStep[] = [];
      if (route.directions) {
        try {
          // If directions is a string, parse it, otherwise use it directly
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
        duration: route.total_duration,
        total_duration: route.total_duration,
        creator: route.creator,
        attractions: transformedAttractions,
        isPublic: Boolean(route.is_public),
        directions: parsedDirections
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
    console.log('Route clicked:', route.id);
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
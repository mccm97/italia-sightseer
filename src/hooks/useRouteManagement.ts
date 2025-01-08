import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Route, Attraction, DirectionsStep } from '@/types/route';
import { generateSummary } from '@/services/summarization';
import { useQuery } from '@tanstack/react-query';

export function useRouteManagement(selectedCity: any, toast: any) {
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [showRoutePreview, setShowRoutePreview] = useState(false);
  const [routeSummary, setRouteSummary] = useState<string>('');

  const fetchRoutesForCity = useCallback(async () => {
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

    return routes?.map(route => {
      // Transform attractions with proper type checking
      const transformedAttractions: Attraction[] = route.route_attractions?.map((ra: any) => {
        // Ensure position is always a tuple of [number, number]
        const lat = Number(ra.attraction.lat) || 0;
        const lng = Number(ra.attraction.lng) || 0;
        const position: [number, number] = [lat, lng];

        return {
          name: String(ra.attraction.name),
          position,
          visitDuration: Number(ra.attraction.visit_duration),
          price: Number(ra.attraction.price) || 0
        };
      }) || [];

      // Parse directions with proper type checking
      const parsedDirections: DirectionsStep[] = Array.isArray(route.directions) 
        ? route.directions.map((step: any) => ({
            instruction: typeof step === 'object' && step !== null ? String(step.instruction || '') : '',
            distance: typeof step === 'object' && step !== null ? Number(step.distance || 0) : 0,
            duration: typeof step === 'object' && step !== null ? Number(step.duration || 0) : 0
          }))
        : [];

      return {
        id: route.id,
        cityName: selectedCity.name,
        name: route.name,
        duration: route.total_duration,
        total_duration: route.total_duration,
        creator: route.creator,
        attractions: transformedAttractions,
        isPublic: Boolean(route.is_public),
        directions: parsedDirections,
        image_url: route.image_url,
        description: route.description
      } satisfies Route;
    }) || [];
  }, [selectedCity, toast]);

  const clearRoutes = useCallback(() => {
    setSelectedRoute(null);
    setShowRoutePreview(false);
    setRouteSummary('');
  }, []);

  const { data: cityRoutes = [], isLoading: isLoadingRoutes } = useQuery({
    queryKey: ['cityRoutes', selectedCity?.id],
    queryFn: fetchRoutesForCity,
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
    handleRouteClick,
    fetchRoutesForCity,
    clearRoutes
  };
}
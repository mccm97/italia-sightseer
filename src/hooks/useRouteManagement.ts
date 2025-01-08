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

    return routes?.map(route => ({
      id: route.id,
      cityName: selectedCity.name,
      name: route.name,
      duration: route.total_duration,
      total_duration: route.total_duration,
      creator: route.creator,
      attractions: route.route_attractions?.map((ra: any) => ({
        name: ra.attraction.name,
        position: [ra.attraction.lat, ra.attraction.lng],
        visitDuration: ra.attraction.visit_duration,
        price: ra.attraction.price || 0
      })) || [],
      isPublic: route.is_public,
      directions: route.directions || [],
      image_url: route.image_url,
      description: route.description
    })) || [];
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
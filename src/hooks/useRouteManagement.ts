import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Route } from '@/types/route';
import { generateSummary } from '@/services/summarization';

export function useRouteManagement(selectedCity: any, toast: any) {
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [showRoutePreview, setShowRoutePreview] = useState(false);
  const [cityRoutes, setCityRoutes] = useState<Route[]>([]);
  const [isLoadingRoutes, setIsLoadingRoutes] = useState(false);
  const [routeSummary, setRouteSummary] = useState<string>('');

  const fetchCityRoutes = async () => {
    if (!selectedCity?.id) return;
    
    setIsLoadingRoutes(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      let query = supabase
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

      if (user) {
        query = query.or(`is_public.eq.true,user_id.eq.${user.id}`);
      } else {
        query = query.eq('is_public', true);
      }

      const { data: routes, error } = await query;

      if (error) {
        console.error('Error fetching routes:', error);
        toast({
          title: "Errore",
          description: "Impossibile caricare i percorsi per questa città",
          variant: "destructive"
        });
        return;
      }

      if (!routes) {
        console.log('No routes found');
        setCityRoutes([]);
        return;
      }

      const transformedRoutes: Route[] = routes.map(route => ({
        id: route.id,
        cityName: selectedCity.name,
        name: route.name,
        duration: route.total_duration,
        total_duration: route.total_duration,
        creator: route.creator,
        attractions: route.route_attractions
          .filter((ra: any) => ra.attraction)
          .map((ra: any) => {
            const position: [number, number] | undefined = 
              ra.attraction.lat != null && ra.attraction.lng != null
                ? [ra.attraction.lat, ra.attraction.lng]
                : undefined;
            
            return {
              name: ra.attraction.name,
              position,
              visitDuration: ra.attraction.visit_duration,
              price: ra.attraction.price || undefined
            };
          })
          .filter(attr => attr.position),
        isPublic: route.is_public,
        directions: route.directions ? (route.directions as any[]).map((dir: any) => ({
          instruction: dir.instruction,
          distance: dir.distance,
          duration: dir.duration
        })) : undefined
      }));

      setCityRoutes(transformedRoutes);
    } catch (error) {
      console.error('Error in fetchCityRoutes:', error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante il caricamento dei percorsi",
        variant: "destructive"
      });
    } finally {
      setIsLoadingRoutes(false);
    }
  };

  const handleRouteClick = async (route: Route) => {
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
  };

  return {
    selectedRoute,
    showRoutePreview,
    setShowRoutePreview,
    cityRoutes,
    isLoadingRoutes,
    routeSummary,
    handleRouteClick,
    fetchCityRoutes
  };
}
import React, { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { HomeHero } from '@/components/home/HomeHero';
import { AboutSection } from '@/components/home/AboutSection';
import { CitySearchSection } from '@/components/home/CitySearchSection';
import { CityView } from '@/components/city/CityView';
import { CreateRouteDialog } from '@/components/CreateRouteDialog';
import { DirectionsDialog } from '@/components/route/DirectionsDialog';
import { RoutePreviewDialog } from '@/components/home/RoutePreviewDialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { generateSummary } from '@/services/summarization';
import { Route, DirectionsStep } from '@/types/route';

interface City {
  id?: string;
  name: string;
  lat: number;
  lng: number;
  country?: string;
}

const Index = () => {
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [showRoutePreview, setShowRoutePreview] = useState(false);
  const [cityRoutes, setCityRoutes] = useState<Route[]>([]);
  const [isLoadingRoutes, setIsLoadingRoutes] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [showDirections, setShowDirections] = useState(false);
  const [selectedRouteDirections, setSelectedRouteDirections] = useState<DirectionsStep[]>([]);
  const [routeSummary, setRouteSummary] = useState<string>('');
  const { toast } = useToast();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('username, avatar_url')
          .eq('id', user.id)
          .single();
        
        setUser({ ...user, ...profile });
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchCityRoutes = async () => {
      if (!selectedCity?.id) return;
      
      setIsLoadingRoutes(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        const query = supabase
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
          query.or(`is_public.eq.true,user_id.eq.${user.id}`);
        } else {
          query.eq('is_public', true);
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
          })) as DirectionsStep[] : undefined
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

    fetchCityRoutes();
  }, [selectedCity, toast]);

  const handleRouteClick = async (route: Route) => {
    setSelectedRoute(route);
    setShowRoutePreview(true);
    
    if (route.directions) {
      setSelectedRouteDirections(route.directions);
    }

    const summary = await generateSummary(route.attractions);
    setRouteSummary(summary);
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Header user={user} />
      <HomeHero />
      <AboutSection />

      {!selectedCity ? (
        <div className="flex justify-center">
          <CitySearchSection setSelectedCity={setSelectedCity} />
        </div>
      ) : (
        <CityView
          city={selectedCity}
          routes={cityRoutes}
          isLoadingRoutes={isLoadingRoutes}
          selectedRoute={selectedRoute}
          onBackClick={() => {
            setSelectedCity(null);
            setSelectedRoute(null);
          }}
          onRouteClick={handleRouteClick}
          onDirectionsClick={(directions) => {
            setSelectedRouteDirections(directions);
            setShowDirections(true);
          }}
        />
      )}

      <CreateRouteDialog />

      <RoutePreviewDialog
        showRoutePreview={showRoutePreview}
        setShowRoutePreview={setShowRoutePreview}
        selectedRoute={selectedRoute}
        selectedCity={selectedCity}
        routeSummary={routeSummary}
      />

      <DirectionsDialog
        isOpen={showDirections}
        onClose={() => setShowDirections(false)}
        directions={selectedRouteDirections}
      />
    </div>
  );
};

export default Index;
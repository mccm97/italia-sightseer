import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreateRouteDialog } from '@/components/CreateRouteDialog';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { RoutePreview } from '@/components/RoutePreview';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { DirectionsDialog } from '@/components/route/DirectionsDialog';
import { Header } from '@/components/layout/Header';
import { Route, DirectionsStep } from '@/data/routes';
import { HomeHero } from '@/components/home/HomeHero';
import { CityView } from '@/components/city/CityView';
import { CitySearchSection } from '@/components/home/CitySearchSection';
import { generateSummary } from '@/services/summarization';

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
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showDirections, setShowDirections] = useState(false);
  const [selectedRouteDirections, setSelectedRouteDirections] = useState<DirectionsStep[]>([]);
  const [routeSummary, setRouteSummary] = useState<string>('');

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
      <section className="bg-gray-100 p-4 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Chi Siamo</h2>
        <p>
          WayWonder è una piattaforma che ti aiuta a esplorare le meraviglie dell'Italia
          attraverso percorsi personalizzati. Scopri le attrazioni culturali, pianifica i tuoi
          itinerari e vivi un'esperienza indimenticabile.
        </p>
      </section>
      <section className="bg-gray-100 p-4 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Cosa Offriamo</h2>
        <ul className="list-disc pl-5">
          <li>Pianificazione di percorsi personalizzati</li>
          <li>Calcolo dei tempi e dei costi</li>
          <li>Visualizzazione delle attrazioni principali</li>
          <li>Consigli sugli itinerari migliori</li>
          <li>Gestione delle tue preferenze di viaggio</li>
        </ul>
      </section>

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

      <Dialog open={showRoutePreview} onOpenChange={setShowRoutePreview}>
        <DialogContent className="sm:max-w-[800px]">
          {selectedRoute && (
            <RoutePreview
              formData={{
                name: selectedRoute.name,
                city: {
                  id: selectedCity?.id || 'temp-id',
                  name: selectedRoute.cityName,
                  lat: selectedRoute.attractions[0]?.position?.[0] || selectedCity?.lat || 0,
                  lng: selectedRoute.attractions[0]?.position?.[1] || selectedCity?.lng || 0,
                  country: selectedCity?.country
                },
                country: selectedCity?.country || 'Italy',
                attractions: selectedRoute.attractions.map(attr => ({
                  name: attr.name,
                  address: '',
                  inputType: 'name',
                  visitDuration: attr.visitDuration,
                  price: attr.price || 0
                })),
                attractionsCount: selectedRoute.attractions.length,
                transportMode: 'walking'
              }}
              onBack={() => setShowRoutePreview(false)}
            />
          )}
          {routeSummary && (
            <div className="mt-4">
              <h3 className="text-xl font-bold">Riassunto del percorso:</h3>
              <p>{routeSummary}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <DirectionsDialog
        isOpen={showDirections}
        onClose={() => setShowDirections(false)}
        directions={selectedRouteDirections}
      />
    </div>
  );
};

export default Index;

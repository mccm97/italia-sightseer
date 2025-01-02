import React, { useState, useEffect } from 'react';
import CitySearch from '@/components/CitySearch';
import CityMap from '@/components/CityMap';
import { Button } from '@/components/ui/button';
import { ArrowLeft, LogIn } from 'lucide-react';
import { Route } from '@/data/routes';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { CreateRouteDialog } from '@/components/CreateRouteDialog';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { RoutePreview } from '@/components/RoutePreview';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

const Index = () => {
  const [selectedCity, setSelectedCity] = useState<{
    id?: string;
    name: string;
    lat: number;
    lng: number;
    country?: string;
  } | null>(null);

  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [showRoutePreview, setShowRoutePreview] = useState(false);
  const [cityRoutes, setCityRoutes] = useState<Route[]>([]);
  const [isLoadingRoutes, setIsLoadingRoutes] = useState(false);
  const [user, setUser] = useState<any>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
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
            profiles (username)
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

        console.log('Fetched routes:', routes);

        const transformedRoutes: Route[] = routes.map(route => ({
          id: route.id,
          cityName: selectedCity.name,
          name: route.name,
          duration: route.total_duration,
          price: route.route_attractions.reduce((sum, ra) => sum + (ra.attraction?.price || 0), 0),
          username: route.profiles.username,
          attractions: route.route_attractions
            .filter(ra => ra.attraction) // Filter out any null attractions
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
            .filter(attr => attr.position), // Only include attractions with valid positions
          isPublic: route.is_public
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

  const handleBackClick = () => {
    setSelectedCity(null);
    setSelectedRoute(null);
  };

  const handleRouteClick = (route: Route) => {
    // Only set the route if it has valid attractions with positions
    if (route.attractions.some(attr => attr.position)) {
      setSelectedRoute(route);
      setShowRoutePreview(true);
    } else {
      toast({
        title: "Errore",
        description: "Questo percorso non ha attrazioni valide da visualizzare sulla mappa",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-end">
        {user ? (
          <Avatar onClick={() => navigate('/profile')} className="cursor-pointer">
            <AvatarImage src={user.user_metadata.avatar_url} alt={user.email} />
            <AvatarFallback>{user.email.charAt(0)}</AvatarFallback>
          </Avatar>
        ) : (
          <Button onClick={handleLoginClick} variant="ghost">
            <LogIn className="mr-2 h-4 w-4" />
            Accedi
          </Button>
        )}
      </div>
      {!selectedCity ? (
        <div className="max-w-4xl mx-auto space-y-8 py-12">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-primary">Italia Sightseer</h1>
            <p className="text-xl text-muted-foreground">
              Pianifica i tuoi itinerari culturali in Italia con facilità
            </p>
          </div>
          
          <div className="aspect-video relative rounded-xl overflow-hidden shadow-xl">
            <img 
              src="/lovable-uploads/172840ab-5378-44c5-941a-9be547232b05.png" 
              alt="Vista panoramica di Barcellona" 
              className="object-cover w-full h-full"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <h2 className="text-2xl font-bold mb-2">Esplora le Città Italiane</h2>
              <p className="text-lg">Crea percorsi personalizzati e scopri i monumenti più belli</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div className="p-6 space-y-2">
              <h3 className="font-semibold text-lg">Pianifica Percorsi</h3>
              <p className="text-muted-foreground">Crea itinerari personalizzati per le tue visite culturali</p>
            </div>
            <div className="p-6 space-y-2">
              <h3 className="font-semibold text-lg">Calcola Tempi e Costi</h3>
              <p className="text-muted-foreground">Gestisci durata e budget del tuo itinerario</p>
            </div>
            <div className="p-6 space-y-2">
              <h3 className="font-semibold text-lg">Esplora le Città</h3>
              <p className="text-muted-foreground">Scopri i migliori percorsi nelle città italiane</p>
            </div>
          </div>

          <div className="max-w-xl mx-auto">
            <CitySearch onCitySelect={setSelectedCity} />
          </div>
        </div>
      ) : (
        <>
          <div className="w-full flex items-center justify-between">
            <Button 
              variant="ghost" 
              onClick={handleBackClick}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Indietro
            </Button>
            <h1 className="text-3xl font-bold">{selectedCity.name}</h1>
            <div className="w-[100px]" />
          </div>

          <div className="rounded-lg overflow-hidden shadow-lg">
            <CityMap 
              center={[selectedCity.lat, selectedCity.lng]}
              routes={cityRoutes}
              onRouteClick={handleRouteClick}
              attractions={selectedRoute?.attractions.filter(attr => attr.position) || []}
              showWalkingPath={!!selectedRoute}
            />
          </div>

          <div className="mt-6">
            <h2 className="text-2xl font-semibold mb-4">Percorsi Disponibili</h2>
            <ScrollArea className="h-[300px] rounded-md border">
              <div className="p-4 space-y-4">
                {isLoadingRoutes ? (
                  <p className="text-center text-gray-500">
                    Caricamento percorsi...
                  </p>
                ) : cityRoutes.length > 0 ? (
                  cityRoutes.map((route) => (
                    <Card 
                      key={route.id}
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => handleRouteClick(route)}
                    >
                      <CardHeader>
                        <CardTitle>{route.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">Creato da: {route.username}</p>
                      </CardHeader>
                      <CardContent>
                        <p>Durata totale: {route.duration} minuti</p>
                        <p>Prezzo totale: €{route.price}</p>
                        <p>Attrazioni: {route.attractions.length}</p>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <p className="text-center text-gray-500">
                    Nessun percorso disponibile per questa città
                  </p>
                )}
              </div>
            </ScrollArea>
          </div>
        </>
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
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;

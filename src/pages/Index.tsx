import React, { useState } from 'react';
import CitySearch from '@/components/CitySearch';
import CityMap from '@/components/CityMap';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Route, sampleRoutes } from '@/data/routes';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { CreateRouteDialog } from '@/components/CreateRouteDialog';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { RoutePreview } from '@/components/RoutePreview';

const Index = () => {
  const [selectedCity, setSelectedCity] = useState<{
    name: string;
    lat: number;
    lng: number;
  } | null>(null);

  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [showRoutePreview, setShowRoutePreview] = useState(false);

  const cityRoutes = selectedCity 
    ? sampleRoutes.filter(route => route.cityName.toLowerCase() === selectedCity.name.toLowerCase())
    : [];

  const handleBackClick = () => {
    setSelectedCity(null);
    setSelectedRoute(null);
  };

  const handleRouteClick = (route: Route) => {
    setSelectedRoute(route);
    setShowRoutePreview(true);
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
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
              attractions={selectedRoute?.attractions || []}
              showWalkingPath={!!selectedRoute}
            />
          </div>

          <div className="mt-6">
            <h2 className="text-2xl font-semibold mb-4">Percorsi Disponibili</h2>
            <ScrollArea className="h-[300px] rounded-md border">
              <div className="p-4 space-y-4">
                {cityRoutes.length > 0 ? (
                  cityRoutes.map((route) => (
                    <Card 
                      key={route.id}
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => handleRouteClick(route)}
                    >
                      <CardHeader>
                        <CardTitle>{route.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p>Durata totale: {route.duration} minuti</p>
                        <p>Attrazioni: {route.attractions.length}</p>
                        <p>Costo totale: €{route.attractions.reduce((sum, attr) => sum + (attr.price || 0), 0)}</p>
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
                city: { name: selectedRoute.cityName, lat: selectedRoute.attractions[0].position[0], lng: selectedRoute.attractions[0].position[1] },
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
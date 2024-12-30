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
    ? sampleRoutes.filter(route => route.cityName === selectedCity.name)
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
      <div className="flex flex-col items-center space-y-4">
        {selectedCity ? (
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
        ) : (
          <>
            <h1 className="text-3xl font-bold">Tour Planner Italia</h1>
            <CitySearch onCitySelect={setSelectedCity} />
          </>
        )}
      </div>

      {selectedCity && (
        <>
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
                        <p>Durata: {route.duration} minuti</p>
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
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">{selectedRoute.name}</h2>
              <div className="h-[400px]">
                <CityMap
                  center={selectedRoute.attractions[0].position}
                  attractions={selectedRoute.attractions}
                  showWalkingPath={true}
                />
              </div>
              <div className="space-y-2">
                <p><strong>Durata totale:</strong> {selectedRoute.duration} minuti</p>
                <div>
                  <strong>Attrazioni:</strong>
                  <ul className="list-disc pl-5 mt-2">
                    {selectedRoute.attractions.map((attraction, index) => (
                      <li key={index}>
                        {attraction.name} ({attraction.visitDuration} min)
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
import React from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowLeft } from 'lucide-react';
import { RouteCard } from '@/components/route/RouteCard';
import CityMap from '@/components/CityMap';
import { Route } from '@/data/routes';

interface CityViewProps {
  city: {
    id?: string;
    name: string;
    lat: number;
    lng: number;
    country?: string;
  };
  routes: Route[];
  isLoadingRoutes: boolean;
  selectedRoute: Route | null;
  onBackClick: () => void;
  onRouteClick: (route: Route) => void;
  onDirectionsClick: (directions: any[]) => void;
}

export const CityView = ({
  city,
  routes,
  isLoadingRoutes,
  selectedRoute,
  onBackClick,
  onRouteClick,
  onDirectionsClick,
}: CityViewProps) => {
  return (
    <>
      <div className="w-full flex items-center justify-between">
        <Button 
          variant="ghost" 
          onClick={onBackClick}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Indietro
        </Button>
        <h1 className="text-3xl font-bold">{city.name}</h1>
        <div className="w-[100px]" />
      </div>

      <div className="rounded-lg overflow-hidden shadow-lg">
        <CityMap 
          center={[city.lat, city.lng]}
          routes={routes}
          onRouteClick={onRouteClick}
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
            ) : routes.length > 0 ? (
              routes.map((route) => (
                <RouteCard
                  key={route.id}
                  route={route}
                  onRouteClick={() => onRouteClick(route)}
                  onDirectionsClick={() => {
                    onDirectionsClick(route.directions || []);
                  }}
                />
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
  );
};
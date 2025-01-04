import { ScrollArea } from "@/components/ui/scroll-area";
import { CityBanner } from "./CityBanner";
import { RouteCard } from "../route/RouteCard";
import { Attraction, Route } from "@/types/route";

interface CityViewProps {
  city: {
    id?: string;
    name: string;
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
      <CityBanner city={city} onBackClick={onBackClick} />

      <div className="mt-6">
        <h2 className="text-2xl font-semibold mb-4">Percorsi Disponibili</h2>
        <ScrollArea className="h-[500px] rounded-md border">
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
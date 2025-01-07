import { ScrollArea } from "@/components/ui/scroll-area";
import { CityBanner } from "./CityBanner";
import { RouteCard } from "../route/RouteCard";
import { Attraction, Route } from "@/types/route";
import { Loader2, MapPin } from "lucide-react";

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
              <div className="flex flex-col items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
                <p className="text-muted-foreground">Caricamento percorsi...</p>
              </div>
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
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <MapPin className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium text-muted-foreground">
                  Nessun percorso disponibile per {city.name}
                </p>
                <p className="text-sm text-muted-foreground mt-2 max-w-md">
                  Al momento non ci sono percorsi disponibili per questa città. Sii il primo a crearne uno!
                </p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </>
  );
};
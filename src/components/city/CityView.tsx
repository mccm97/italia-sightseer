import { ScrollArea } from "@/components/ui/scroll-area";
import { CityBanner } from "./CityBanner";
import { RouteCard } from "../route/RouteCard";
import { Attraction, Route } from "@/types/route";
import { Loader2, MapPin } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CityRatings } from "./CityRatings";
import { useSession } from "@/hooks/useSession";

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
}

export const CityView = ({
  city,
  routes,
  isLoadingRoutes,
  selectedRoute,
  onBackClick,
  onRouteClick,
}: CityViewProps) => {
  const { session } = useSession();

  return (
    <>
      <CityBanner city={city} onBackClick={onBackClick} />

      <Tabs defaultValue="routes" className="mt-6">
        <TabsList className="w-full">
          <TabsTrigger value="routes" className="flex-1">Percorsi</TabsTrigger>
          <TabsTrigger value="ratings" className="flex-1">Recensioni</TabsTrigger>
        </TabsList>

        <TabsContent value="routes">
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
        </TabsContent>

        <TabsContent value="ratings">
          <div className="mt-6">
            <h2 className="text-2xl font-semibold mb-4">Recensioni</h2>
            <div className="p-4 border rounded-md">
              <CityRatings 
                cityId={city.id || ''} 
                userId={session?.user?.id}
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
};
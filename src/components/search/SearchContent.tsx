import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, MapPin } from 'lucide-react';
import { RouteCard } from '@/components/route/RouteCard';
import { BlogPost } from '@/components/blog/BlogPost';
import type { City } from '@/components/CitySearch';
import { Route } from '@/types/route';

interface SearchContentProps {
  selectedCity: City | null;
  cityRoutes: Route[];
  isLoadingRoutes: boolean;
  handleRouteClick: (route: Route) => void;
  cityPosts: any[];
  isLoadingPosts: boolean;
}

export function SearchContent({ 
  selectedCity,
  cityRoutes,
  isLoadingRoutes,
  handleRouteClick,
  cityPosts,
  isLoadingPosts
}: SearchContentProps) {
  if (!selectedCity) return null;

  return (
    <Tabs defaultValue="routes" className="w-full mt-6">
      <TabsList className="grid w-full grid-cols-2 mb-6">
        <TabsTrigger value="routes">Percorsi</TabsTrigger>
        <TabsTrigger value="posts">Blog Posts</TabsTrigger>
      </TabsList>

      <TabsContent value="routes">
        <div className="mt-6">
          <h2 className="text-2xl font-semibold mb-4">Percorsi Disponibili</h2>
          {isLoadingRoutes ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
              <p className="text-muted-foreground">Caricamento percorsi...</p>
            </div>
          ) : cityRoutes.length > 0 ? (
            cityRoutes.map((route) => (
              <RouteCard
                key={route.id}
                route={route}
                onRouteClick={() => handleRouteClick(route)}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <MapPin className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium text-muted-foreground">
                Nessun percorso disponibile per {selectedCity.name}
              </p>
              <p className="text-sm text-muted-foreground mt-2 max-w-md">
                Al momento non ci sono percorsi disponibili per questa città. Sii il primo a crearne uno!
              </p>
            </div>
          )}
        </div>
      </TabsContent>

      <TabsContent value="posts">
        <div className="mt-6">
          <h2 className="text-2xl font-semibold mb-4">Post del Blog</h2>
          {isLoadingPosts ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : cityPosts && cityPosts.length > 0 ? (
            <div className="space-y-8">
              {cityPosts.map((post) => (
                <BlogPost key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">Nessun post pubblicato per questa città</p>
            </div>
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
}
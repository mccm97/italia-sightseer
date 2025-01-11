import React, { useEffect, useState } from 'react';
import { CitySearchSection } from '@/components/home/CitySearchSection';
import { useNavigate } from 'react-router-dom';
import { MainMenu } from '@/components/MainMenu';
import { Header } from '@/components/layout/Header';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Helmet } from 'react-helmet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CityView } from '@/components/city/CityView';
import { BlogPost } from '@/components/blog/BlogPost';
import { useRouteManagement } from '@/hooks/useRouteManagement';
import { Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import type { City } from '@/components/CitySearch';
import { CityBanner } from '@/components/city/CityBanner';

export default function Search() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const { toast } = useToast();

  const { 
    selectedRoute,
    cityRoutes,
    isLoadingRoutes,
    handleRouteClick
  } = useRouteManagement(selectedCity, toast);

  const { data: cityPosts, isLoading: isLoadingPosts } = useQuery({
    queryKey: ['cityPosts', selectedCity?.id],
    queryFn: async () => {
      if (!selectedCity?.id) return [];
      
      const { data, error } = await supabase
        .from('blog_posts')
        .select(`
          *,
          profiles:user_id (
            username,
            avatar_url
          )
        `)
        .eq('city_id', selectedCity.id)
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching city posts:', error);
        throw error;
      }

      return data || [];
    },
    enabled: !!selectedCity?.id
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: { user: currentUser }, error } = await supabase.auth.getUser();
        
        if (error) {
          console.error('Error fetching user:', error);
          toast({
            title: "Errore",
            description: "Errore nel caricamento del profilo",
            variant: "destructive",
          });
          return;
        }

        if (currentUser) {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', currentUser.id)
            .single();

          if (profileError) {
            console.error('Error fetching profile:', profileError);
            return;
          }

          setUser(profile);
        }
      } catch (error) {
        console.error('Error in fetchUser:', error);
      }
    };

    fetchUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        setUser(profile);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [toast]);

  return (
    <>
      <Helmet>
        <title>Cerca Città - WayWonder</title>
        <meta name="description" content="Cerca e scopri le città italiane più belle. Trova la tua prossima destinazione e crea itinerari personalizzati con WayWonder." />
        <meta name="keywords" content="cerca città, destinazioni Italia, itinerari personalizzati, pianifica viaggio" />
        <link rel="canonical" href="https://waywonder.com/search" />
        <meta property="og:title" content="Cerca Città - WayWonder" />
        <meta property="og:description" content="Cerca e scopri le città italiane più belle. Crea il tuo itinerario personalizzato." />
        <meta property="og:url" content="https://waywonder.com/search" />
      </Helmet>
      <div className="container mx-auto p-4">
        <div className="flex items-center gap-4 mb-6">
          <MainMenu />
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Indietro
          </Button>
        </div>
        
        <Header user={user} />
        
        {!selectedCity ? (
          <CitySearchSection setSelectedCity={setSelectedCity} />
        ) : (
          <div className="space-y-6">
            <CityBanner city={selectedCity} onBackClick={() => setSelectedCity(null)} />
            
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
          </div>
        )}
      </div>
    </>
  );
}

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

interface City {
  id: string;
  name: string;
  lat: number;
  lng: number;
  country?: string;
}

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
      <div className="container mx-auto p-4 space-y-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Indietro
          </Button>
        </div>
        <MainMenu />
        <Header user={user} />
        
        {!selectedCity ? (
          <CitySearchSection setSelectedCity={setSelectedCity} />
        ) : (
          <div className="space-y-6">
            <Button 
              variant="ghost" 
              onClick={() => setSelectedCity(null)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Torna alla ricerca
            </Button>

            <Tabs defaultValue="routes" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="routes">Percorsi</TabsTrigger>
                <TabsTrigger value="posts">Blog Posts</TabsTrigger>
              </TabsList>

              <TabsContent value="routes">
                <CityView
                  city={selectedCity}
                  routes={cityRoutes}
                  isLoadingRoutes={isLoadingRoutes}
                  selectedRoute={selectedRoute}
                  onBackClick={() => setSelectedCity(null)}
                  onRouteClick={handleRouteClick}
                />
              </TabsContent>

              <TabsContent value="posts">
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
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </>
  );
}
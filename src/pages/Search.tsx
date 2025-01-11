import React, { useEffect, useState } from 'react';
import { CitySearchSection } from '@/components/home/CitySearchSection';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Helmet } from 'react-helmet';
import { useRouteManagement } from '@/hooks/useRouteManagement';
import type { City } from '@/components/CitySearch';
import { CityBanner } from '@/components/city/CityBanner';
import { useQuery } from '@tanstack/react-query';
import { SearchHeader } from '@/components/search/SearchHeader';
import { SearchContent } from '@/components/search/SearchContent';

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
        <SearchHeader user={user} />
        
        {!selectedCity ? (
          <CitySearchSection setSelectedCity={setSelectedCity} />
        ) : (
          <div className="space-y-6">
            <CityBanner city={selectedCity} onBackClick={() => setSelectedCity(null)} />
            
            <SearchContent 
              selectedCity={selectedCity}
              cityRoutes={cityRoutes}
              isLoadingRoutes={isLoadingRoutes}
              handleRouteClick={handleRouteClick}
              cityPosts={cityPosts || []}
              isLoadingPosts={isLoadingPosts}
            />
          </div>
        )}
      </div>
    </>
  );
}
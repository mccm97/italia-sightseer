import React, { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { HomeHero } from '@/components/home/HomeHero';
import { AboutSection } from '@/components/home/AboutSection';
import { CitySearchSection } from '@/components/home/CitySearchSection';
import { CityView } from '@/components/city/CityView';
import { CreateRouteDialog } from '@/components/CreateRouteDialog';
import { DirectionsDialog } from '@/components/route/DirectionsDialog';
import { RoutePreviewDialog } from '@/components/home/RoutePreviewDialog';
import { MainMenu } from '@/components/MainMenu';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Route, DirectionsStep } from '@/types/route';
import { useRouteManagement } from '@/hooks/useRouteManagement';

interface City {
  id?: string;
  name: string;
  lat: number;
  lng: number;
  country?: string;
}

export function HomeContainer() {
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [showDirections, setShowDirections] = useState(false);
  const [selectedRouteDirections, setSelectedRouteDirections] = useState<DirectionsStep[]>([]);
  const [user, setUser] = useState<any>(null);
  const { toast } = useToast();
  const { 
    selectedRoute,
    showRoutePreview,
    setShowRoutePreview,
    cityRoutes,
    isLoadingRoutes,
    routeSummary,
    handleRouteClick
  } = useRouteManagement(selectedCity, toast);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
        if (authError) {
          console.error('Error fetching auth user:', authError);
          return;
        }
        
        if (authUser) {
          try {
            const { data: profile, error: profileError } = await supabase
              .from('profiles')
              .select('username, avatar_url')
              .eq('id', authUser.id)
              .maybeSingle();
            
            if (profileError) {
              console.error('Error fetching profile:', profileError);
              toast({
                title: "Errore",
                description: "Impossibile caricare il profilo utente",
                variant: "destructive",
              });
              return;
            }
            
            if (profile) {
              setUser({ ...authUser, ...profile });
            } else {
              setUser(authUser);
              console.log('No profile found for user, using auth data only');
            }
          } catch (profileFetchError) {
            console.error('Unexpected error fetching profile:', profileFetchError);
            setUser(authUser);
          }
        }
      } catch (error) {
        console.error('Unexpected error during user fetch:', error);
        toast({
          title: "Errore",
          description: "Si è verificato un errore durante il caricamento dei dati utente",
          variant: "destructive",
        });
      }
    };

    fetchUser();
  }, [toast]);

  return (
    <div className="container mx-auto p-4 space-y-6">
      <MainMenu />
      <Header user={user} />
      <HomeHero />
      <AboutSection />

      {!selectedCity ? (
        <div className="flex justify-center">
          <CitySearchSection setSelectedCity={setSelectedCity} />
        </div>
      ) : (
        <CityView
          city={selectedCity}
          routes={cityRoutes}
          isLoadingRoutes={isLoadingRoutes}
          selectedRoute={selectedRoute}
          onBackClick={() => {
            setSelectedCity(null);
          }}
          onRouteClick={handleRouteClick}
        />
      )}

      <CreateRouteDialog />

      <RoutePreviewDialog
        showRoutePreview={showRoutePreview}
        setShowRoutePreview={setShowRoutePreview}
        selectedRoute={selectedRoute}
        selectedCity={selectedCity}
        routeSummary={routeSummary}
      />

      <DirectionsDialog
        isOpen={showDirections}
        onClose={() => setShowDirections(false)}
        directions={selectedRouteDirections}
      />
    </div>
  );
}

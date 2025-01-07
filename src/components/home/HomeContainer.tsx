import React, { useState, useEffect, useCallback } from 'react';
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
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) {
          console.error('Error fetching user:', error);
          return;
        }
        
        if (user) {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('username, avatar_url')
            .eq('id', user.id)
            .maybeSingle();
          
          if (profileError) {
            console.error('Error fetching profile:', profileError);
            return;
          }
          
          setUser({ ...user, ...profile });
        }
      } catch (error) {
        console.error('Unexpected error during user fetch:', error);
      }
    };
    fetchUser();
  }, []);

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
          onDirectionsClick={(directions) => {
            setSelectedRouteDirections(directions);
            setShowDirections(true);
          }}
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
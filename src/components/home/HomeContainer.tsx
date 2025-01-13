import React, { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { HomeHero } from '@/components/home/HomeHero';
import { AboutSection } from '@/components/home/AboutSection';
import { CityView } from '@/components/city/CityView';
import { CreateRouteDialog } from '@/components/CreateRouteDialog';
import { DirectionsDialog } from '@/components/route/DirectionsDialog';
import { RoutePreviewDialog } from '@/components/home/RoutePreviewDialog';
import { MainMenu } from '@/components/MainMenu';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Route, DirectionsStep } from '@/types/route';
import { useRouteManagement } from '@/hooks/useRouteManagement';
import { useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface City {
  id?: string;
  name: string;
  lat: number;
  lng: number;
  country?: string;
}

export function HomeContainer() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
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

  useEffect(() => {
    if (location.state?.selectedCity) {
      setSelectedCity(location.state.selectedCity);
      // Clear the state after using it
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  return (
    <div className="container mx-auto p-4 space-y-6">
      <MainMenu />
      <Header user={user} />
      
      {!selectedCity ? (
        <>
          <div className="text-center mb-12">
            <Button 
              onClick={() => navigate('/search')}
              className="inline-flex items-center gap-2"
              size="lg"
            >
              <Search className="h-5 w-5" />
              {t('search.searchPlaceholder')}
            </Button>
          </div>
          <HomeHero />
          <AboutSection />
        </>
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
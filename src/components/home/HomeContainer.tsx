import { useState, useEffect } from 'react';
import CitySearch from '../CitySearch';
import { CityView } from '../city/CityView';
import { useRouteManagement } from '@/hooks/useRouteManagement';
import { RoutePreviewDialog } from './RoutePreviewDialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Route } from '@/types/route';

export function HomeContainer() {
  const [selectedCity, setSelectedCity] = useState<any>(null);
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [showRoutePreview, setShowRoutePreview] = useState(false);
  const { toast } = useToast();

  const {
    cityRoutes,
    isLoadingRoutes,
    routeSummary,
    handleRouteClick,
    fetchRoutesForCity,
    clearRoutes
  } = useRouteManagement(selectedCity, toast);

  useEffect(() => {
    if (selectedCity) {
      console.log('Fetching routes for city:', selectedCity.id);
      fetchRoutesForCity();
    } else {
      clearRoutes();
    }
  }, [selectedCity, fetchRoutesForCity, clearRoutes]);

  const handleCitySelect = async (city: any) => {
    if (!city) {
      setSelectedCity(null);
      clearRoutes();
      return;
    }

    try {
      console.log('Fetching image for city:', city.id);
      const { data: imageData, error: imageError } = await supabase
        .from('city_images')
        .select('image_url')
        .eq('city_id', city.id)
        .maybeSingle();

      console.log('City image query result:', imageData);

      if (imageError) {
        console.error('Error fetching city image:', imageError);
        throw imageError;
      }

      setSelectedCity({
        ...city,
        image_url: imageData?.image_url
      });

    } catch (error) {
      console.error('Error in city selection:', error);
      toast({
        title: "Errore",
        description: "Impossibile caricare i dettagli della città",
        variant: "destructive"
      });
    }
  };

  const handleCloseRoutePreview = () => {
    setShowRoutePreview(false);
    setSelectedRoute(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {!selectedCity ? (
        <CitySearch onCitySelect={handleCitySelect} />
      ) : (
        <CityView
          city={selectedCity}
          routes={cityRoutes}
          isLoadingRoutes={isLoadingRoutes}
          selectedRoute={selectedRoute}
          onBackClick={() => {
            setSelectedCity(null);
            clearRoutes();
          }}
          onRouteClick={handleRouteClick}
        />
      )}

      <RoutePreviewDialog
        showRoutePreview={showRoutePreview}
        setShowRoutePreview={setShowRoutePreview}
        selectedRoute={selectedRoute}
        selectedCity={selectedCity}
        routeSummary={routeSummary}
      />
    </div>
  );
}
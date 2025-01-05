import { useState } from 'react';
import { CreateRouteFormData } from '@/types/route';
import { useToast } from '../use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Json } from '@/integrations/supabase/types';
import { useDirections } from '../useDirections';
import { useRouteValidation } from './useRouteValidation';

export function useRouteCreation() {
  const [formData, setFormData] = useState<CreateRouteFormData | null>(null);
  const [screenshotBlob, setScreenshotBlob] = useState<Blob | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { getDirections } = useDirections();
  const { validateRouteCreation } = useRouteValidation();

  const handleFormSubmit = async (data: CreateRouteFormData, userId: string) => {
    const isValid = await validateRouteCreation(data, userId);
    if (isValid) {
      setFormData(data);
      return true;
    }
    return false;
  };

  const createRoute = async () => {
    if (!formData) return false;

    try {
      console.log('Creating route with data:', formData);
      
      const points = formData.attractions.map(attr => {
        return [0, 0] as [number, number];
      });
      
      const directions = await getDirections(points);
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.error('No authenticated user found');
        toast({
          title: "Errore",
          description: "Devi essere autenticato per creare un percorso.",
          variant: "destructive"
        });
        return false;
      }

      // First check if a route with this name already exists for this user
      const { data: existingRoutes } = await supabase
        .from('routes')
        .select('id')
        .eq('user_id', user.id)
        .eq('name', formData.name);

      if (existingRoutes && existingRoutes.length > 0) {
        toast({
          title: "Nome duplicato",
          description: "Hai già un percorso con questo nome. Scegli un nome diverso.",
          variant: "destructive"
        });
        return false;
      }

      // Create route without ON CONFLICT clause
      const { data: route, error: routeError } = await supabase
        .from('routes')
        .insert({
          name: formData.name,
          city_id: formData.city?.id,
          user_id: user.id,
          transport_mode: formData.transportMode || 'walking',
          total_duration: calculateTotalDuration(),
          total_distance: 0,
          country: formData.country,
          is_public: true,
          directions: directions as unknown as Json
        })
        .select()
        .single();

      if (routeError) {
        console.error('Error creating route:', routeError);
        throw new Error('Failed to create route');
      }

      await createAttractions(route.id);
      await uploadScreenshot(route.id);

      toast({
        title: "Percorso creato",
        description: "Il percorso è stato creato con successo.",
        variant: "default"
      });

      return true;
    } catch (error) {
      console.error('Error creating route:', error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore. Riprova più tardi.",
        variant: "destructive"
      });
      return false;
    }
  };

  const createAttractions = async (routeId: string) => {
    if (!formData) return;

    for (const [index, attr] of formData.attractions.entries()) {
      const { data: attraction, error: attractionError } = await supabase
        .from('attractions')
        .insert({
          name: attr.name || attr.address,
          lat: 0,
          lng: 0,
          visit_duration: attr.visitDuration,
          price: attr.price,
          city_id: formData.city?.id
        })
        .select()
        .single();

      if (attractionError || !attraction) {
        console.error('Error creating attraction:', attractionError);
        throw new Error('Failed to create attraction');
      }

      const { error: linkError } = await supabase
        .from('route_attractions')
        .insert({
          route_id: routeId,
          attraction_id: attraction.id,
          order_index: index,
          transport_mode: formData.transportMode || 'walking',
          travel_duration: 0,
          travel_distance: 0
        });

      if (linkError) {
        console.error('Error linking attraction to route:', linkError);
        throw new Error('Failed to link attraction to route');
      }
    }
  };

  const uploadScreenshot = async (routeId: string) => {
    if (screenshotBlob) {
      const { error: screenshotError } = await supabase
        .storage
        .from('screenshots')
        .upload(`${routeId}.png`, screenshotBlob, {
          contentType: 'image/png',
        });

      if (screenshotError) {
        console.error('Error uploading screenshot:', screenshotError);
      }
    }
  };

  const calculateTotalDuration = () => {
    return formData?.attractions.reduce((total, attr) => total + (attr.visitDuration || 0), 0) || 0;
  };

  const calculateTotalPrice = () => {
    return formData?.attractions.reduce((total, attr) => total + (attr.price || 0), 0) || 0;
  };

  return {
    formData,
    setFormData,
    handleFormSubmit,
    createRoute,
    calculateTotalDuration,
    calculateTotalPrice,
    setScreenshotBlob
  };
}
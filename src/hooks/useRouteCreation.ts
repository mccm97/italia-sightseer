import { useState } from 'react';
import { CreateRouteFormData } from '@/types/route';
import { useToast } from './use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Json } from '@/integrations/supabase/types';
import { useDirections } from './useDirections';

export function useRouteCreation() {
  const [formData, setFormData] = useState<CreateRouteFormData | null>(null);
  const [screenshotBlob, setScreenshotBlob] = useState<Blob | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { getDirections } = useDirections();

  const handleFormSubmit = async (data: CreateRouteFormData, userId: string) => {
    try {
      console.log('Checking if user can create route...');
      const { data: canCreate, error: checkError } = await supabase
        .rpc('can_create_route', { input_user_id: userId });

      if (checkError) {
        console.error('Error checking route creation permission:', checkError);
        throw new Error('Failed to check route creation permission');
      }

      if (!canCreate) {
        toast({
          title: "Limite raggiunto",
          description: "Hai raggiunto il limite mensile di percorsi. Passa a un piano superiore per crearne altri.",
          variant: "destructive"
        });
        navigate('/upgrade');
        return false;
      }

      setFormData(data);
      return true;
    } catch (error) {
      console.error('Error in form submission:', error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore. Riprova più tardi.",
        variant: "destructive"
      });
      return false;
    }
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

      // Check if a route with this name already exists for the user
      const { data: existingRoutes, error: checkError } = await supabase
        .from('routes')
        .select('id')
        .eq('user_id', user.id)
        .eq('name', formData.name);

      if (checkError) {
        console.error('Error checking existing routes:', checkError);
        throw new Error('Failed to check existing routes');
      }

      if (existingRoutes && existingRoutes.length > 0) {
        toast({
          title: "Nome duplicato",
          description: "Hai già un percorso con questo nome. Scegli un nome diverso.",
          variant: "destructive"
        });
        return false;
      }

      // Create route
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
        .onConflict(['name', 'user_id']) // Usa il vincolo unico corretto
        .select()
        .single();

      if (routeError) {
        console.error('Error creating route:', routeError);
        throw new Error('Failed to create route');
      }

      if (!route) {
        console.error('No route returned after creation');
        throw new Error('Failed to create route');
      }

      // Create attractions sequentially 
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
            route_id: route.id,
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

      if (screenshotBlob) {
        const { error: screenshotError } = await supabase
          .storage
          .from('screenshots')
          .upload(`${route.id}.png`, screenshotBlob, {
            contentType: 'image/png',
          });

        if (screenshotError) {
          console.error('Error uploading screenshot:', screenshotError);
          // Don't throw error here, just log it
        }
      }

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

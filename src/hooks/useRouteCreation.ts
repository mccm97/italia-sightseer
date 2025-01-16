import { useState } from 'react';
import { CreateRouteFormData } from '@/types/route';
import { useToast } from './use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useRouteValidation } from './useRouteValidation';

export function useRouteCreation() {
  const [formData, setFormData] = useState<CreateRouteFormData | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { checkDuplicateRouteName, validateRouteData } = useRouteValidation();

  const calculateTotalDuration = () => {
    return formData?.attractions.reduce((total, attr) => total + (attr.visitDuration || 0), 0) || 0;
  };

  const calculateTotalPrice = () => {
    return formData?.attractions.reduce((total, attr) => total + (attr.price || 0), 0) || 0;
  };

  const handleFormSubmit = async (data: CreateRouteFormData, userId: string) => {
    try {
      console.log('Starting form submission process...', data);
      
      if (!validateRouteData(data.city?.id)) {
        return false;
      }

      const isDuplicate = await checkDuplicateRouteName(userId, data.city!.id, data.name);
      if (isDuplicate) {
        toast({
          title: "Nome percorso duplicato",
          description: "Hai già un percorso con questo nome in questa città. Scegli un nome diverso.",
          variant: "destructive"
        });
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

  const createRoute = async (userId: string) => {
    try {
      if (!formData) {
        console.error('No form data available');
        return false;
      }

      console.log('Creating route with data:', formData);

      const totalDuration = calculateTotalDuration();
      const totalDistance = 0; // This would need to be calculated based on the route

      // First create the route
      const { data: routeData, error: routeError } = await supabase
        .from('routes')
        .insert({
          name: formData.name,
          city_id: formData.city?.id,
          transport_mode: formData.transportMode || 'walking',
          total_duration: totalDuration,
          total_distance: totalDistance,
          is_public: false,
          country: formData.city?.country,
          image_url: formData.image_url,
          description: formData.description,
          user_id: userId
        })
        .select()
        .single();

      if (routeError) {
        console.error('Error creating route:', routeError);
        if (routeError.code === '23505') {
          toast({
            title: "Nome percorso duplicato",
            description: "Hai già un percorso con questo nome in questa città. Scegli un nome diverso.",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Errore",
            description: "Impossibile creare il percorso. Riprova più tardi.",
            variant: "destructive"
          });
        }
        return false;
      }

      console.log('Route created successfully:', routeData);

      // Then insert route attractions
      for (const attr of formData.attractions) {
        console.log('Processing attraction:', attr);
        
        // Get attraction ID from the database based on the name
        const { data: attractionData, error: attractionError } = await supabase
          .from('attractions')
          .select('id')
          .eq('name', attr.name)
          .eq('city_id', formData.city?.id)
          .maybeSingle();

        if (attractionError) {
          console.error('Error fetching attraction:', attractionError);
          continue;
        }

        if (!attractionData?.id) {
          console.error('No attraction found with name:', attr.name);
          continue;
        }

        console.log('Found attraction ID:', attractionData.id);

        const { error: insertError } = await supabase
          .from('route_attractions')
          .insert({
            route_id: routeData.id,
            attraction_id: attractionData.id,
            order_index: formData.attractions.indexOf(attr),
            transport_mode: 'walking',
            travel_duration: 0,
            travel_distance: 0
          });

        if (insertError) {
          console.error('Error adding attraction to route:', insertError);
          toast({
            title: "Errore",
            description: "Errore nell'aggiungere le attrazioni al percorso.",
            variant: "destructive"
          });
          return false;
        }
      }

      toast({
        title: "Successo",
        description: "Percorso creato con successo!",
      });

      // Navigate to profile page after successful creation
      navigate('/profile');
      return true;
    } catch (error) {
      console.error('Error in route creation:', error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante la creazione del percorso.",
        variant: "destructive"
      });
      return false;
    }
  };

  return {
    formData,
    setFormData,
    handleFormSubmit,
    calculateTotalDuration,
    calculateTotalPrice,
    createRoute
  };
}
import { useState } from 'react';
import { CreateRouteFormData } from '@/types/route';
import { useToast } from './use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useDirections } from './useDirections';

export function useRouteCreation() {
  const [formData, setFormData] = useState<CreateRouteFormData | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { getDirections } = useDirections();

  const handleFormSubmit = async (data: CreateRouteFormData, userId: string) => {
    try {
      console.log('Starting form submission process...', data);
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
      console.log('Starting route creation process...');
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Errore",
          description: "Devi essere autenticato per creare un percorso.",
          variant: "destructive"
        });
        return false;
      }

      // Create route first
      console.log('Creating route in database...');
      const { data: newRoute, error: routeError } = await supabase
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
        })
        .select();

      if (routeError) {
        console.error('Error creating route:', routeError);
        throw new Error('Failed to create route');
      }

      if (!newRoute || newRoute.length === 0) {
        throw new Error('No route was created');
      }

      const route = newRoute[0];
      console.log('Route created successfully:', route);

      // Create attractions and link them to the route
      for (const [index, attr] of formData.attractions.entries()) {
        try {
          console.log(`Creating attraction ${index + 1}/${formData.attractions.length}...`);
          
          // Create attraction
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

          if (attractionError) {
            console.error('Error creating attraction:', attractionError);
            continue;
          }

          if (!attraction) {
            console.error('No attraction was created');
            continue;
          }

          // Link attraction to route
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
          }
        } catch (error) {
          console.error('Error in attraction creation process:', error);
        }
      }

      toast({
        title: "Percorso creato",
        description: "Il percorso è stato creato con successo.",
        variant: "default"
      });

      return true;
    } catch (error) {
      console.error('Error in route creation process:', error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante la creazione del percorso. Riprova più tardi.",
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
    calculateTotalPrice
  };
}
import { useState } from 'react';
import { CreateRouteFormData } from '@/types/route';
import { useToast } from './use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

export function useRouteCreation() {
  const [formData, setFormData] = useState<CreateRouteFormData | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const calculateTotalDuration = () => {
    return formData?.attractions.reduce((total, attr) => total + (attr.visitDuration || 0), 0) || 0;
  };

  const calculateTotalPrice = () => {
    return formData?.attractions.reduce((total, attr) => total + (attr.price || 0), 0) || 0;
  };

  const checkDuplicateRouteName = async (userId: string, routeName: string) => {
    const { data, error } = await supabase
      .from('routes')
      .select('id')
      .eq('user_id', userId)
      .eq('name', routeName)
      .maybeSingle();

    if (error) {
      console.error('Error checking for duplicate route name:', error);
      return true; // Assume duplicate to be safe
    }

    return !!data;
  };

  const handleFormSubmit = async (data: CreateRouteFormData, userId: string) => {
    try {
      console.log('Starting form submission process...', data);
      
      const isDuplicate = await checkDuplicateRouteName(userId, data.name);
      if (isDuplicate) {
        toast({
          title: "Nome percorso duplicato",
          description: "Hai già un percorso con questo nome. Per favore, scegli un nome diverso.",
          variant: "destructive"
        });
        return false;
      }

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

  const getOrCreateAttraction = async (attr: any, cityId: string) => {
    try {
      const { data: existingAttr, error: findError } = await supabase
        .from('attractions')
        .select('*')
        .eq('name', attr.name)
        .eq('city_id', cityId)
        .maybeSingle();

      if (findError) {
        console.error('Error finding attraction:', findError);
        throw findError;
      }

      if (existingAttr) {
        console.log('Found existing attraction:', existingAttr);
        return existingAttr;
      }

      const { data: newAttr, error: createError } = await supabase
        .from('attractions')
        .insert({
          name: attr.name || attr.address,
          lat: 0,
          lng: 0,
          visit_duration: attr.visitDuration,
          price: attr.price,
          city_id: cityId
        })
        .select('*')
        .single();

      if (createError) {
        console.error('Error creating attraction:', createError);
        throw createError;
      }

      console.log('Created new attraction:', newAttr);
      return newAttr;
    } catch (error) {
      console.error('Error in getOrCreateAttraction:', error);
      throw error;
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

      // Double-check for duplicate names right before creation
      const isDuplicate = await checkDuplicateRouteName(user.id, formData.name);
      if (isDuplicate) {
        toast({
          title: "Nome percorso duplicato",
          description: "Hai già un percorso con questo nome. Per favore, scegli un nome diverso.",
          variant: "destructive"
        });
        return false;
      }

      console.log('Creating route in database...');
      const { data: routeData, error: routeError } = await supabase
        .from('routes')
        .insert({
          name: formData.name,
          city_id: formData.city?.id,
          user_id: user.id,
          transport_mode: formData.transportMode || 'walking',
          total_duration: calculateTotalDuration(),
          total_distance: 0,
          country: formData.country,
          is_public: true
        })
        .select('*')
        .single();

      if (routeError) {
        console.error('Error creating route:', routeError);
        if (routeError.code === '23505') {
          toast({
            title: "Nome percorso duplicato",
            description: "Hai già un percorso con questo nome. Per favore, scegli un nome diverso.",
            variant: "destructive"
          });
        } else {
          throw routeError;
        }
        return false;
      }

      console.log('Route created successfully:', routeData);

      for (const [index, attr] of formData.attractions.entries()) {
        try {
          const attractionData = await getOrCreateAttraction(attr, formData.city?.id || '');

          const { error: linkError } = await supabase
            .from('route_attractions')
            .insert({
              route_id: routeData.id,
              attraction_id: attractionData.id,
              order_index: index,
              transport_mode: formData.transportMode || 'walking',
              travel_duration: 0,
              travel_distance: 0
            });

          if (linkError) {
            console.error('Error linking attraction to route:', linkError);
            throw linkError;
          }
        } catch (error) {
          console.error('Error in attraction creation/linking process:', error);
          throw error;
        }
      }

      toast({
        title: "Percorso creato",
        description: "Il percorso è stato creato con successo.",
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

  return {
    formData,
    setFormData,
    handleFormSubmit,
    createRoute,
    calculateTotalDuration,
    calculateTotalPrice
  };
}
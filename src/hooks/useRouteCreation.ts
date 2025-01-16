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

  const getUniqueRouteName = async (baseName: string, cityId: string, userId: string) => {
    console.log('Checking for unique route name:', baseName);
    
    // First try with the original name
    const { data: existingRoute } = await supabase
      .from('routes')
      .select('id')
      .eq('name', baseName)
      .eq('city_id', cityId)
      .eq('user_id', userId)
      .maybeSingle();

    if (!existingRoute) {
      return baseName;
    }

    // If exists, append timestamp
    const timestamp = new Date().toISOString().slice(11, 19).replace(/:/g, '-');
    const newName = `${baseName} (${timestamp})`;
    console.log('Generated unique name:', newName);
    return newName;
  };

  const handleFormSubmit = async (data: CreateRouteFormData, userId: string) => {
    try {
      console.log('Starting form submission process...', data);
      
      const isDuplicate = await checkDuplicateRouteName(userId, data.name);
      if (isDuplicate) {
        const uniqueName = await getUniqueRouteName(data.name, data.city?.id || '', userId);
        data.name = uniqueName;
      }

      const { data: canCreate } = await supabase.rpc('can_create_route', { input_user_id: userId });

      if (!canCreate) {
        // Verifica il livello di sottoscrizione dell'utente
        const { data: profile } = await supabase
          .from('profiles')
          .select('subscription_level')
          .eq('id', userId)
          .single();

        if (profile?.subscription_level === 'bronze') {
          toast({
            title: "Limite mensile raggiunto",
            description: "Con il piano Bronze puoi creare solo un percorso al mese. Passa a un piano superiore per crearne di più!",
            variant: "destructive"
          });
        } else if (profile?.subscription_level === 'silver') {
          toast({
            title: "Limite mensile raggiunto",
            description: "Con il piano Silver puoi creare solo 10 percorsi al mese. Passa al piano Gold per avere percorsi illimitati!",
            variant: "destructive"
          });
        }
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

  const createRoute = async (userId: string) => {
    try {
      if (!formData) {
        console.error('No form data available');
        return false;
      }

      const totalDuration = calculateTotalDuration();
      const totalDistance = 0; // This would need to be calculated based on the route

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
        toast({
          title: "Errore",
          description: "Impossibile creare il percorso. Riprova più tardi.",
          variant: "destructive"
        });
        return false;
      }

      console.log('Route created successfully:', routeData);

      // Insert route attractions
      const attractionPromises = formData.attractions.map((attr, index) => {
        if (!attr.attractionId) {
          console.error('Missing attraction ID for:', attr);
          return Promise.reject(new Error('Missing attraction ID'));
        }
        
        return supabase
          .from('route_attractions')
          .insert({
            route_id: routeData.id,
            attraction_id: attr.attractionId,
            order_index: index,
            transport_mode: 'walking',
            travel_duration: 0,
            travel_distance: 0
          });
      });

      await Promise.all(attractionPromises);

      toast({
        title: "Successo",
        description: "Percorso creato con successo!",
      });

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

// Helper functions
async function checkDuplicateRouteName(userId: string, routeName: string) {
  const { data, error } = await supabase
    .from('routes')
    .select('id')
    .eq('user_id', userId)
    .eq('name', routeName)
    .maybeSingle();

  if (error) {
    console.error('Error checking for duplicate route name:', error);
    return true;
  }

  return !!data;
}
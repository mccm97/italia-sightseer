import { useState } from 'react';
import { CreateRouteFormData } from '@/types/route';
import { useToast } from '../use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Json } from '@/integrations/supabase/types';
import { useDirections } from '../useDirections';
import { checkExistingRoute, createNewRoute, createAttractions } from '@/services/routeService';

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

      const hasExistingRoute = await checkExistingRoute(user.id, formData.name);
      if (hasExistingRoute) {
        toast({
          title: "Nome duplicato",
          description: "Hai già un percorso con questo nome. Scegli un nome diverso.",
          variant: "destructive"
        });
        return false;
      }

      const points = formData.attractions.map(attr => [0, 0] as [number, number]);
      const directions = await getDirections(points) as Json;
      
      const route = await createNewRoute(formData, user.id, directions);
      await createAttractions(formData, route.id, formData.city?.id);

      if (screenshotBlob) {
        const { error: screenshotError } = await supabase
          .storage
          .from('screenshots')
          .upload(`${route.id}.png`, screenshotBlob, {
            contentType: 'image/png',
          });

        if (screenshotError) {
          console.error('Error uploading screenshot:', screenshotError);
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
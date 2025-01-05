import { useState } from 'react';
import { CreateRouteFormData } from '@/types/route';
import { useToast } from './use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useDirections } from './useDirections';
import { 
  createNewRoute, 
  createAttractions, 
  calculateTotalDuration, 
  calculateTotalPrice 
} from '@/services/routeCreationService';

export function useRouteCreation() {
  const [formData, setFormData] = useState<CreateRouteFormData | null>(null);
  const [screenshotBlob, setScreenshotBlob] = useState<Blob | null>(null);
  const { toast } = useToast();
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

      const points = formData.attractions.map(attr => [0, 0] as [number, number]);
      const directions = await getDirections(points);
      
      const route = await createNewRoute(formData, user.id, directions as any);
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
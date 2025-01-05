import { CreateRouteFormData } from '@/types/route';
import { useToast } from '../use-toast';
import { supabase } from '@/integrations/supabase/client';

export function useRouteValidation() {
  const { toast } = useToast();

  const validateRouteCreation = async (data: CreateRouteFormData, userId: string) => {
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

      return true;
    } catch (error) {
      console.error('Error in validation:', error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante la validazione. Riprova più tardi.",
        variant: "destructive"
      });
      return false;
    }
  };

  return { validateRouteCreation };
}
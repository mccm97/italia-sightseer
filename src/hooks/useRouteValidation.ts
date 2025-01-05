import { CreateRouteFormData } from '@/types/route';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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

      // Check for existing route with same name
      const { data: existingRoutes, error: existingError } = await supabase
        .from('routes')
        .select('id')
        .eq('user_id', userId)
        .eq('name', data.name);

      if (existingError) {
        console.error('Error checking existing routes:', existingError);
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

      return true;
    } catch (error) {
      console.error('Error in route validation:', error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore. Riprova più tardi.",
        variant: "destructive"
      });
      return false;
    }
  };

  return { validateRouteCreation };
}
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function useRouteValidation() {
  const { toast } = useToast();

  const checkDuplicateRouteName = async (userId: string, cityId: string, routeName: string) => {
    console.log('Checking for duplicate route name:', { userId, cityId, routeName });
    
    const { data, error } = await supabase
      .from('routes')
      .select('id')
      .eq('user_id', userId)
      .eq('city_id', cityId)
      .eq('name', routeName)
      .maybeSingle();

    if (error) {
      console.error('Error checking for duplicate route:', error);
      return true;
    }

    return !!data;
  };

  const validateRouteData = (cityId: string | undefined) => {
    if (!cityId) {
      toast({
        title: "Errore",
        description: "Seleziona una città",
        variant: "destructive"
      });
      return false;
    }
    return true;
  };

  return {
    checkDuplicateRouteName,
    validateRouteData
  };
}
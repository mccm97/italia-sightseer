import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';

export function useLogout() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleLogout = async () => {
    try {
      console.log('Iniziando il processo di logout...');
      
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      // Clear React Query cache
      queryClient.clear();

      console.log('Logout completato con successo');
      
      // Show success toast
      toast({
        title: "Logout effettuato con successo",
        description: "La tua sessione è stata chiusa correttamente",
        variant: "default",
        duration: 3000,
      });

      // Navigate to home page
      navigate('/');

    } catch (error) {
      console.error('Errore durante il logout:', error);
      toast({
        title: "Errore durante il logout",
        description: "Si è verificato un errore durante la chiusura della sessione",
        variant: "destructive",
        duration: 5000,
      });
    }
  };

  return { handleLogout };
}
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

export function useAuthStateChange(setUser: (user: any) => void) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Cambio stato auth:', event, {
        session_id: session?.access_token,
        user_id: session?.user?.id,
        expires_at: session?.expires_at
      });

      switch (event) {
        case 'SIGNED_IN':
          console.log('Utente autenticato con successo');
          if (session?.user) {
            setUser(session.user);
            navigate('/');
          }
          break;
        case 'SIGNED_OUT':
          console.log('Utente disconnesso');
          setUser(null);
          queryClient.clear();
          navigate('/');
          break;
        case 'TOKEN_REFRESHED':
          console.log('Token di sessione aggiornato');
          if (session?.user) setUser(session.user);
          break;
        case 'USER_UPDATED':
          console.log('Profilo utente aggiornato');
          if (session?.user) setUser(session.user);
          break;
        case 'INITIAL_SESSION':
          console.log('Sessione iniziale caricata');
          if (session?.user) setUser(session.user);
          break;
        default:
          if (!session) {
            console.log('Errore di autenticazione, effettuo logout');
            await supabase.auth.signOut();
            setUser(null);
            queryClient.clear();
            navigate('/');
            toast({
              title: "Sessione scaduta",
              description: "Per favore, effettua nuovamente l'accesso",
              variant: "destructive",
            });
          }
          break;
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, queryClient, setUser, toast]);
}
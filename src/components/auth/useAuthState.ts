import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

export function useAuthState() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    async function checkSession() {
      try {
        console.log('Verifico la sessione esistente...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Errore durante il controllo della sessione:', error);
          await supabase.auth.signOut();
          if (mounted) {
            setUser(null);
          }
          return;
        }

        if (session?.user && mounted) {
          console.log('Sessione utente trovata:', {
            id: session.user.id,
            email: session.user.email,
            expires_at: session.expires_at
          });
          setUser(session.user);
        } else {
          console.log('Nessuna sessione attiva trovata');
          if (mounted) {
            setUser(null);
          }
        }
      } catch (error) {
        console.error('Errore durante l\'inizializzazione auth:', error);
        await supabase.auth.signOut();
        if (mounted) {
          setUser(null);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;
      
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
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate, queryClient, toast]);

  return { user, loading };
}
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

export function useSession() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function getInitialSession() {
      try {
        console.log('Verifico la sessione esistente...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Errore durante il controllo della sessione:', error);
          await supabase.auth.signOut();
          if (mounted) setUser(null);
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
          if (mounted) setUser(null);
        }
      } catch (error) {
        console.error('Errore durante l\'inizializzazione auth:', error);
        if (mounted) setUser(null);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    getInitialSession();

    return () => {
      mounted = false;
    };
  }, []);

  return { user, loading };
}
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogIn, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';

export function AuthButton() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    let mounted = true;

    async function checkSession() {
      try {
        console.log('Verifico la sessione esistente...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Errore durante il controllo della sessione:', error);
          if (mounted) {
            setUser(null);
            // Clear any existing session data
            await supabase.auth.signOut();
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
        if (mounted) {
          setUser(null);
          // Clear any existing session data on error
          await supabase.auth.signOut();
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

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
      }
    });

    // Initial session check
    checkSession();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate, queryClient]);

  const handleSignOut = async () => {
    try {
      setLoading(true);
      console.log('Avvio processo di logout...');
      
      // Sign out from Supabase and clear all local storage
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Errore durante il logout:', error);
        throw error;
      }
      
      console.log('Logout completato con successo');
      toast({
        title: "Logout effettuato",
        description: "Hai effettuato il logout con successo",
      });
    } catch (error) {
      console.error('Errore durante il processo di logout:', error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante il logout",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Button variant="ghost" disabled>Caricamento...</Button>;
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user.user_metadata?.avatar_url} alt={user.email} />
                <AvatarFallback>
                  {user.email?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => navigate('/profile')}>
              <User className="mr-2 h-4 w-4" />
              Profilo
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleSignOut}>
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button onClick={() => navigate('/login')} variant="ghost">
          <LogIn className="mr-2 h-4 w-4" />
          Accedi
        </Button>
      )}
    </div>
  );
}
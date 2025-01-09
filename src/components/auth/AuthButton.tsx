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
    const initializeAuth = async () => {
      try {
        // First, get the current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          await handleSignOut(); // Clean up if session is invalid
          return;
        }

        if (session?.user) {
          console.log('Valid session found:', session.user.id);
          setUser(session.user);
        } else {
          console.log('No active session');
          await handleSignOut();
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        await handleSignOut();
      } finally {
        setLoading(false);
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state change:', event);
      
      switch (event) {
        case 'SIGNED_IN':
          if (session?.user) {
            console.log('User signed in:', session.user.id);
            setUser(session.user);
          }
          break;
        case 'SIGNED_OUT':
          console.log('User signed out');
          await handleSignOut();
          break;
        case 'TOKEN_REFRESHED':
          if (session?.user) {
            console.log('Token refreshed for:', session.user.id);
            setUser(session.user);
          }
          break;
        case 'USER_UPDATED':
          if (session?.user) {
            console.log('User updated:', session.user.id);
            setUser(session.user);
          }
          break;
        default:
          console.log('Unhandled auth event:', event);
      }
    });

    // Initialize auth state
    initializeAuth();

    return () => {
      console.log('Cleaning up auth subscriptions');
      subscription.unsubscribe();
    };
  }, [navigate, queryClient]);

  const handleSignOut = async () => {
    try {
      setLoading(true);
      // Clear all local storage and cache
      localStorage.clear();
      queryClient.clear();
      
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      navigate('/');
      
      toast({
        title: "Logout effettuato",
        description: "Hai effettuato il logout con successo",
      });
    } catch (error) {
      console.error('Logout error:', error);
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
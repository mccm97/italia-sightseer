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
        setLoading(true);
        // Clear any stale session data
        queryClient.clear();
        localStorage.removeItem('sb-shcbdouqszburohgegcb-auth-token');
        
        const { data: { session }, error } = await supabase.auth.getSession();
        console.log('Session check:', session?.user?.id || 'No session');
        
        if (error) {
          console.error('Session error:', error);
          await handleSignOut();
          return;
        }

        setUser(session?.user || null);
      } catch (error) {
        console.error('Auth error:', error);
        await handleSignOut();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth event:', event, session?.user?.id);
      
      switch (event) {
        case 'SIGNED_IN':
          console.log('User signed in:', session?.user?.id);
          setUser(session?.user || null);
          break;
        case 'SIGNED_OUT':
          console.log('User signed out');
          await handleSignOut();
          break;
        case 'TOKEN_REFRESHED':
          console.log('Token refreshed for user:', session?.user?.id);
          setUser(session?.user || null);
          break;
        default:
          console.log('Unhandled auth event:', event);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    try {
      setLoading(true);
      
      // Clear client state
      setUser(null);
      queryClient.clear();
      
      // Clear all storage
      localStorage.removeItem('sb-shcbdouqszburohgegcb-auth-token');
      
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Sign out error:', error);
        throw error;
      }
      
      toast({
        title: "Logout effettuato",
        description: "Hai effettuato il logout con successo",
      });
      
      navigate('/');
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
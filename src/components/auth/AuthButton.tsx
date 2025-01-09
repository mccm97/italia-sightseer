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
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    const getInitialSession = async () => {
      try {
        setLoading(true);
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Error getting session:', sessionError);
          setError(sessionError.message);
          toast({
            title: "Errore di autenticazione",
            description: sessionError.message,
            variant: "destructive",
          });
          return;
        }

        setUser(session?.user ?? null);
      } catch (err) {
        console.error('Error in getInitialSession:', err);
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log('Auth state changed:', _event, session ? 'User authenticated' : 'No session');
      setUser(session?.user ?? null);
      setError(null); // Clear any previous errors
      
      // Invalidate all queries when auth state changes
      queryClient.invalidateQueries();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [toast, queryClient]);

  const handleSignOut = async () => {
    try {
      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) {
        console.error('Error signing out:', signOutError);
        toast({
          title: "Errore",
          description: "Si è verificato un errore durante il logout",
          variant: "destructive",
        });
        return;
      }

      // Invalidate all queries after logout
      queryClient.invalidateQueries();
      
      toast({
        title: "Logout effettuato",
        description: "Hai effettuato il logout con successo",
      });
      
      // Navigate to home page after logout
      navigate('/');
    } catch (err) {
      console.error('Error in handleSignOut:', err);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante il logout",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <Button variant="ghost" disabled>Caricamento...</Button>;
  }

  if (error) {
    return (
      <Button 
        variant="ghost" 
        onClick={() => navigate('/login')}
        className="text-red-500"
      >
        Errore di autenticazione
      </Button>
    );
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
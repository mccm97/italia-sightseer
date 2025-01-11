import React, { useEffect, useState } from 'react';
import { CitySearchSection } from '@/components/home/CitySearchSection';
import { useNavigate } from 'react-router-dom';
import { MainMenu } from '@/components/MainMenu';
import { Header } from '@/components/layout/Header';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Helmet } from 'react-helmet';

export default function Search() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: { user: currentUser }, error } = await supabase.auth.getUser();
        
        if (error) {
          console.error('Error fetching user:', error);
          toast({
            title: "Errore",
            description: "Errore nel caricamento del profilo",
            variant: "destructive",
          });
          return;
        }

        if (currentUser) {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', currentUser.id)
            .single();

          if (profileError) {
            console.error('Error fetching profile:', profileError);
            return;
          }

          setUser(profile);
        }
      } catch (error) {
        console.error('Error in fetchUser:', error);
      }
    };

    fetchUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        setUser(profile);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [toast]);

  return (
    <>
      <Helmet>
        <title>Cerca Città - WayWonder</title>
        <meta name="description" content="Cerca e scopri le città italiane più belle. Trova la tua prossima destinazione e crea itinerari personalizzati con WayWonder." />
        <meta name="keywords" content="cerca città, destinazioni Italia, itinerari personalizzati, pianifica viaggio" />
        <link rel="canonical" href="https://waywonder.com/search" />
        <meta property="og:title" content="Cerca Città - WayWonder" />
        <meta property="og:description" content="Cerca e scopri le città italiane più belle. Crea il tuo itinerario personalizzato." />
        <meta property="og:url" content="https://waywonder.com/search" />
      </Helmet>
      <div className="container mx-auto p-4 space-y-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Indietro
          </Button>
        </div>
        <MainMenu />
        <Header user={user} />
        <CitySearchSection 
          setSelectedCity={(city) => {
            if (city) {
              navigate('/', { state: { selectedCity: city } });
            }
          }} 
        />
      </div>
    </>
  );
}
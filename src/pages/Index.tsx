import { HomeHero } from '@/components/home/HomeHero';
import { HomeContainer } from '@/components/home/HomeContainer';
import { AboutSection } from '@/components/home/AboutSection';
import { Header } from '@/components/layout/Header';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export default function Index() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="min-h-screen">
      <Header user={user} />
      <HomeHero />
      <div className="container mx-auto px-4 py-12 space-y-12">
        <HomeContainer />
        <AboutSection />
      </div>
    </div>
  );
}
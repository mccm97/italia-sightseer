import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CityImageManager } from '@/components/admin/CityImageManager';
import { AdminUserManager } from '@/components/admin/AdminUserManager';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Helmet } from 'react-helmet';

export default function Admin() {
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
        return;
      }

      const { data: adminUser } = await supabase
        .from('admin_users')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!adminUser) {
        navigate('/');
        return;
      }

      setIsAdmin(true);
    };

    checkAdminStatus();
  }, [navigate]);

  if (!isAdmin) return null;

  return (
    <>
      <Helmet>
        <title>Pannello di Amministrazione - WayWonder</title>
        <meta name="description" content="Pannello di amministrazione per la gestione di WayWonder. Accesso riservato agli amministratori." />
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href="https://waywonder.com/admin" />
      </Helmet>
      <div className="container mx-auto p-4 space-y-6">
        <Button variant="ghost" onClick={() => navigate('/')} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Indietro
        </Button>

        <h1 className="text-3xl font-bold mb-6">Pannello di Amministrazione</h1>

        <Tabs defaultValue="cities" className="w-full">
          <TabsList>
            <TabsTrigger value="cities">Gestione Città</TabsTrigger>
            <TabsTrigger value="users">Gestione Utenti</TabsTrigger>
          </TabsList>

          <TabsContent value="cities" className="mt-6">
            <CityImageManager />
          </TabsContent>

          <TabsContent value="users" className="mt-6">
            <AdminUserManager />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CityImageManager } from '@/components/admin/CityImageManager';
import { AdminUserManager } from '@/components/admin/AdminUserManager';
import { StatisticsView } from '@/components/admin/StatisticsView';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

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
    <div className="container mx-auto p-4 space-y-6">
      <Button variant="ghost" onClick={() => navigate('/')} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Indietro
      </Button>

      <h1 className="text-3xl font-bold mb-6">Pannello di Amministrazione</h1>

      <Tabs defaultValue="statistics" className="w-full">
        <TabsList>
          <TabsTrigger value="statistics">Statistiche</TabsTrigger>
          <TabsTrigger value="cities">Gestione Città</TabsTrigger>
          <TabsTrigger value="users">Gestione Utenti</TabsTrigger>
        </TabsList>

        <TabsContent value="statistics" className="mt-6">
          <StatisticsView />
        </TabsContent>

        <TabsContent value="cities" className="mt-6">
          <CityImageManager />
        </TabsContent>

        <TabsContent value="users" className="mt-6">
          <AdminUserManager />
        </TabsContent>
      </Tabs>
    </div>
  );
}
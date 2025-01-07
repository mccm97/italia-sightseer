import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Users, Map, Heart, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { StatCard } from '@/components/statistics/StatCard';
import { StatisticsChart } from '@/components/statistics/StatisticsChart';
import { DailyStats } from '@/types/statistics';

export default function Statistics() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [stats, setStats] = useState<DailyStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        console.log('Checking admin status...');
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          console.log('No user found, redirecting to login');
          navigate('/login');
          return;
        }

        const { data: adminUser, error: adminError } = await supabase
          .from('admin_users')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (adminError) {
          console.error('Error checking admin status:', adminError);
          toast({
            title: "Errore",
            description: "Errore nel controllo dei permessi di amministratore",
            variant: "destructive",
          });
          navigate('/');
          return;
        }

        if (!adminUser) {
          console.log('User is not an admin, redirecting to home');
          toast({
            title: "Accesso negato",
            description: "Non hai i permessi per accedere a questa pagina",
            variant: "destructive",
          });
          navigate('/');
          return;
        }

        console.log('User is admin, proceeding to fetch stats');
        setIsAdmin(true);
        fetchStats();
      } catch (error) {
        console.error('Error in checkAdminStatus:', error);
        navigate('/');
      }
    };

    checkAdminStatus();
  }, [navigate, toast]);

  const fetchStats = async () => {
    try {
      console.log('Fetching statistics...');
      const { data, error } = await supabase
        .from('site_statistics')
        .select('*')
        .order('date', { ascending: true });

      if (error) {
        console.error('Error fetching statistics:', error);
        toast({
          title: "Errore",
          description: "Errore nel caricamento delle statistiche",
          variant: "destructive",
        });
        return;
      }

      console.log('Statistics data:', data);
      setStats(data || []);
    } catch (error) {
      console.error('Error in fetchStats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAdmin || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  const totalVisits = stats.reduce((sum, day) => sum + (day.visits_count || 0), 0);
  const totalRoutes = stats.reduce((sum, day) => sum + (day.routes_created || 0), 0);
  const totalLikes = stats.reduce((sum, day) => sum + (day.likes_count || 0), 0);
  const totalReviews = stats.reduce((sum, day) => sum + (day.reviews_count || 0), 0);

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Button variant="ghost" onClick={() => navigate('/')} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Indietro
      </Button>

      <h1 className="text-3xl font-bold mb-6">Statistiche del Sito</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Visite Totali" value={totalVisits} Icon={Users} />
        <StatCard title="Percorsi Creati" value={totalRoutes} Icon={Map} />
        <StatCard title="Mi Piace" value={totalLikes} Icon={Heart} />
        <StatCard title="Recensioni" value={totalReviews} Icon={MessageSquare} />
      </div>

      <StatisticsChart data={stats} />
    </div>
  );
}
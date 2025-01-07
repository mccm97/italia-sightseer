import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Users, Map, Heart, MessageSquare } from 'lucide-react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { useToast } from '@/hooks/use-toast';

interface DailyStats {
  date: string;
  visits_count: number;
  routes_created: number;
  likes_count: number;
  reviews_count: number;
}

export default function Statistics() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [stats, setStats] = useState<DailyStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
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
          toast({
            title: "Accesso negato",
            description: "Non hai i permessi per accedere a questa pagina",
            variant: "destructive",
          });
          navigate('/');
          return;
        }

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

  const chartConfig = {
    visits: {
      label: 'Visite',
      color: '#8884d8',
    },
    routes: {
      label: 'Percorsi',
      color: '#82ca9d',
    },
    likes: {
      label: 'Mi Piace',
      color: '#ffc658',
    },
    reviews: {
      label: 'Recensioni',
      color: '#ff7300',
    },
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Button variant="ghost" onClick={() => navigate('/')} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Indietro
      </Button>

      <h1 className="text-3xl font-bold mb-6">Statistiche del Sito</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Visite Totali</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalVisits}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Percorsi Creati</CardTitle>
            <Map className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRoutes}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mi Piace</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLikes}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recensioni</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalReviews}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Andamento nel Tempo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ChartContainer config={chartConfig}>
              <LineChart data={stats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="visits_count" name="Visite" stroke={chartConfig.visits.color} />
                <Line type="monotone" dataKey="routes_created" name="Percorsi" stroke={chartConfig.routes.color} />
                <Line type="monotone" dataKey="likes_count" name="Mi Piace" stroke={chartConfig.likes.color} />
                <Line type="monotone" dataKey="reviews_count" name="Recensioni" stroke={chartConfig.reviews.color} />
              </LineChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
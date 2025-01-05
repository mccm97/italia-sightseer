import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useToast } from '@/hooks/use-toast';

interface Statistics {
  date: string;
  visits_count: number;
  routes_created: number;
  likes_count: number;
  reviews_count: number;
}

export function StatisticsView() {
  const [statistics, setStatistics] = useState<Statistics[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const { data, error } = await supabase
          .from('site_statistics')
          .select('*')
          .order('date', { ascending: true });

        if (error) throw error;
        setStatistics(data || []);
      } catch (error) {
        console.error('Error fetching statistics:', error);
        toast({
          title: "Errore",
          description: "Impossibile caricare le statistiche",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, [toast]);

  if (loading) {
    return <div>Caricamento statistiche...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Statistiche del Sito</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={statistics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="visits_count" stroke="#8884d8" name="Visite" />
                <Line type="monotone" dataKey="routes_created" stroke="#82ca9d" name="Percorsi Creati" />
                <Line type="monotone" dataKey="likes_count" stroke="#ffc658" name="Mi Piace" />
                <Line type="monotone" dataKey="reviews_count" stroke="#ff7300" name="Recensioni" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Visite Totali</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {statistics.reduce((sum, stat) => sum + (stat.visits_count || 0), 0)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Percorsi Creati</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {statistics.reduce((sum, stat) => sum + (stat.routes_created || 0), 0)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mi Piace Totali</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {statistics.reduce((sum, stat) => sum + (stat.likes_count || 0), 0)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recensioni Totali</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {statistics.reduce((sum, stat) => sum + (stat.reviews_count || 0), 0)}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
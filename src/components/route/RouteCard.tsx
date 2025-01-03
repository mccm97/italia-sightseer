import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, ThumbsUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

interface RouteCardProps {
  route: any;
  onRouteClick: () => void;
  onDirectionsClick: () => void;
}

export function RouteCard({ route, onRouteClick, onDirectionsClick }: RouteCardProps) {
  const { toast } = useToast();

  const { data: routeStats } = useQuery({
    queryKey: ['routeStats', route.id],
    queryFn: async () => {
      const [likesResponse, ratingsResponse] = await Promise.all([
        supabase
          .from('route_likes')
          .select('count')
          .eq('route_id', route.id)
          .single(),
        supabase
          .from('route_ratings')
          .select('rating')
          .eq('route_id', route.id)
      ]);

      const likesCount = likesResponse.data?.count || 0;
      const ratings = ratingsResponse.data || [];
      const averageRating = ratings.length > 0 
        ? ratings.reduce((acc: number, curr: any) => acc + curr.rating, 0) / ratings.length 
        : 0;

      return { likesCount, averageRating };
    }
  });

  const handleLike = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: "Errore",
        description: "Devi essere autenticato per mettere like",
        variant: "destructive"
      });
      return;
    }

    const { error } = await supabase
      .from('route_likes')
      .insert({ route_id: route.id, user_id: user.id });

    if (error) {
      if (error.code === '23505') { // Unique violation
        toast({
          title: "Errore",
          description: "Hai già messo like a questo percorso",
          variant: "destructive"
        });
      } else {
        console.error('Error liking route:', error);
        toast({
          title: "Errore",
          description: "Impossibile mettere like al percorso",
          variant: "destructive"
        });
      }
    }
  };

  return (
    <Card className="cursor-pointer hover:bg-gray-50">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <div className="flex flex-col">
            <span>{route.name}</span>
            <span className="text-sm text-muted-foreground">
              Creato da: {route.creator?.username || 'Utente anonimo'}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-1"
              onClick={(e) => {
                e.stopPropagation();
                handleLike();
              }}
            >
              <ThumbsUp className="w-4 h-4" />
              <span>{routeStats?.likesCount || 0}</span>
            </Button>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-400" />
              <span>{routeStats?.averageRating?.toFixed(1) || '0.0'}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onDirectionsClick();
              }}
            >
              Visualizza Indicazioni
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent onClick={onRouteClick}>
        <p>Durata totale: {route.total_duration} minuti</p>
        <p>Attrazioni: {route.attractions?.length || 0}</p>
        <p>Costo totale: €{route.attractions?.reduce((sum: number, attr: any) => sum + (attr.price || 0), 0)}</p>
      </CardContent>
    </Card>
  );
}
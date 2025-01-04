import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, ThumbsUp, ListTree } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { AttractionDetailsDialog } from './AttractionDetailsDialog';

interface RouteCardProps {
  route: any;
  onRouteClick: () => void;
  onDirectionsClick: () => void;
}

export function RouteCard({ route, onRouteClick, onDirectionsClick }: RouteCardProps) {
  const { toast } = useToast();
  const [showAttractions, setShowAttractions] = useState(false);

  const { data: routeStats, refetch: refetchStats } = useQuery({
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
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Errore",
          description: "Devi essere autenticato per mettere like",
          variant: "destructive"
        });
        return;
      }

      const { data: existingLike } = await supabase
        .from('route_likes')
        .select('id')
        .eq('route_id', route.id)
        .eq('user_id', user.id)
        .single();

      if (existingLike) {
        toast({
          title: "Già messo like",
          description: "Hai già messo like a questo percorso",
          variant: "default"
        });
        return;
      }

      const { error } = await supabase
        .from('route_likes')
        .insert({ route_id: route.id, user_id: user.id });

      if (error) {
        console.error('Error liking route:', error);
        toast({
          title: "Errore",
          description: "Impossibile mettere like al percorso",
          variant: "destructive"
        });
        return;
      }

      refetchStats();

      toast({
        title: "Like aggiunto",
        description: "Hai messo like al percorso",
      });

    } catch (error) {
      console.error('Error in handleLike:', error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante l'operazione",
        variant: "destructive"
      });
    }
  };

  return (
    <>
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
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowAttractions(true);
                }}
              >
                <ListTree className="w-4 h-4 mr-2" />
                Dettagli Attrazioni
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

      <AttractionDetailsDialog
        isOpen={showAttractions}
        onClose={() => setShowAttractions(false)}
        attractions={route.attractions}
      />
    </>
  );
}
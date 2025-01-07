import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ThumbsUp, Star, ListTree, ChevronDown } from 'lucide-react';
import { AttractionDetailsDialog } from './AttractionDetailsDialog';
import { generateSummary } from '@/services/summarization';
import { Attraction } from '@/types/route';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface RouteCardProps {
  route: {
    id: string;
    name: string;
    creator?: {
      username: string;
    };
    total_duration: number;
    attractions: Attraction[];
  };
  routeStats?: {
    likesCount: number;
    averageRating: number;
  };
  onRouteClick: () => void;
  onDirectionsClick: () => void;
}

export function RouteCard({
  route,
  routeStats,
  onRouteClick,
  onDirectionsClick
}: RouteCardProps) {
  const [showAttractions, setShowAttractions] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [summary, setSummary] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(routeStats?.likesCount || 0);
  const { toast } = useToast();

  useEffect(() => {
    const checkIfLiked = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('route_likes')
        .select('*')
        .eq('route_id', route.id)
        .eq('user_id', user.id)
        .maybeSingle(); // Changed from .single() to .maybeSingle()

      setIsLiked(!!data);
    };

    checkIfLiked();
  }, [route.id]);

  const handleLikeClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: "Accesso richiesto",
        description: "Devi essere autenticato per mettere mi piace",
        variant: "destructive"
      });
      return;
    }

    try {
      if (isLiked) {
        await supabase
          .from('route_likes')
          .delete()
          .eq('route_id', route.id)
          .eq('user_id', user.id);
        setLikesCount(prev => prev - 1);
      } else {
        await supabase
          .from('route_likes')
          .insert({
            route_id: route.id,
            user_id: user.id
          });
        setLikesCount(prev => prev + 1);
      }
      setIsLiked(!isLiked);
    } catch (error) {
      console.error('Error toggling like:', error);
      toast({
        title: "Errore",
        description: "Impossibile aggiornare il mi piace",
        variant: "destructive"
      });
    }
  };

  const handleShowSummary = async () => {
    setShowSummary(!showSummary);
    if (!summary) {
      const generatedSummary = await generateSummary(route.attractions);
      setSummary(generatedSummary);
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
                onClick={handleLikeClick}
                className={`flex items-center gap-1 ${isLiked ? 'text-red-500' : ''}`}
              >
                <ThumbsUp className="w-4 h-4" />
                <span>{likesCount}</span>
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
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleShowSummary();
                }}
              >
                <ChevronDown className="w-4 h-4" />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent onClick={onRouteClick}>
          <p>Durata totale: {route.total_duration} minuti</p>
          <p>Attrazioni: {route.attractions?.length || 0}</p>
          <p>Costo totale: €{route.attractions?.reduce((sum: number, attr: any) => sum + (attr.price || 0), 0)}</p>
          {showSummary && (
            <div className="mt-4">
              <h3 className="text-xl font-bold">Riassunto del percorso:</h3>
              <p>{summary}</p>
            </div>
          )}
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
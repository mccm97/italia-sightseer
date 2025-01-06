import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ThumbsUp, Star, ListTree, ChevronDown } from 'lucide-react';
import { AttractionDetailsDialog } from './AttractionDetailsDialog';
import { generateSummary } from '@/services/summarization';
import { Attraction } from '@/types/route';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();

  const { data: screenshot } = useQuery({
    queryKey: ['routeScreenshot', route.id],
    queryFn: async () => {
      const { data } = await supabase
        .from('screenshots')
        .select('screenshot_url')
        .eq('route_id', route.id)
        .maybeSingle();
      return data?.screenshot_url;
    }
  });

  const handleShowSummary = async () => {
    setShowSummary(!showSummary);
    if (!summary) {
      const generatedSummary = await generateSummary(route.attractions);
      setSummary(generatedSummary);
    }
  };

  const handleLike = async () => {
    try {
      const { data: existingLike } = await supabase
        .from('route_likes')
        .select()
        .match({ route_id: route.id, user_id: (await supabase.auth.getUser()).data.user?.id })
        .single();

      if (existingLike) {
        await supabase
          .from('route_likes')
          .delete()
          .match({ id: existingLike.id });
        toast({
          title: "Mi piace rimosso",
          description: "Hai rimosso il mi piace dal percorso"
        });
      } else {
        await supabase
          .from('route_likes')
          .insert({
            route_id: route.id,
            user_id: (await supabase.auth.getUser()).data.user?.id
          });
        toast({
          title: "Mi piace aggiunto",
          description: "Hai aggiunto un mi piace al percorso"
        });
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      toast({
        title: "Errore",
        description: "Impossibile aggiungere/rimuovere il mi piace",
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
                onClick={(e) => {
                  e.stopPropagation();
                  handleLike();
                }}
                className="flex items-center gap-1"
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
          {screenshot && (
            <div className="mb-4">
              <img
                src={screenshot}
                alt={`Anteprima del percorso ${route.name}`}
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>
          )}
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
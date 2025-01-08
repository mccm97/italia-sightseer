import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { AttractionDetailsDialog } from './AttractionDetailsDialog';
import { RouteCardHeader } from './RouteCardHeader';
import { RouteCardContent } from './RouteCardContent';
import { CommentSection } from './CommentSection';
import { RouteDescription } from './RouteDescription';
import { RouteImage } from './RouteImage';
import { RouteScreenshot } from './RouteScreenshot';
import { RouteStats } from './RouteStats';
import { Button } from '../ui/button';
import { MessageSquare, ListTree } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
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
    attractions: any[];
    image_url?: string;
    description?: string;
  };
  routeStats?: {
    likesCount: number;
    averageRating: number;
  };
  onRouteClick: () => void;
}

export function RouteCard({
  route,
  routeStats,
  onRouteClick,
}: RouteCardProps) {
  const [showAttractions, setShowAttractions] = useState(false);
  const [showDescription, setShowDescription] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Check if the current user has liked this route
  const { data: userLike } = useQuery({
    queryKey: ['routeLike', route.id],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('route_likes')
        .select('id')
        .eq('route_id', route.id)
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error checking like status:', error);
        return null;
      }

      return data;
    }
  });

  const handleLikeClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast({
        title: "Errore",
        description: "Devi essere autenticato per mettere mi piace",
        variant: "destructive"
      });
      return;
    }

    try {
      if (userLike) {
        const { error } = await supabase
          .from('route_likes')
          .delete()
          .eq('route_id', route.id)
          .eq('user_id', user.id);

        if (error) throw error;

        toast({
          title: "Mi piace rimosso",
          description: "Hai rimosso il mi piace dal percorso"
        });
      } else {
        const { error } = await supabase
          .from('route_likes')
          .insert({
            route_id: route.id,
            user_id: user.id
          });

        if (error) throw error;

        toast({
          title: "Mi piace aggiunto",
          description: "Hai messo mi piace al percorso"
        });
      }

      // Invalidate queries to refresh the UI
      await queryClient.invalidateQueries({ queryKey: ['routeLike', route.id] });
      await queryClient.invalidateQueries({ queryKey: ['routeLikes', route.id] });
    } catch (error) {
      console.error('Error toggling like:', error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante l'operazione",
        variant: "destructive"
      });
    }
  };

  return (
    <>
      <Card className="cursor-pointer hover:bg-gray-50 relative">
        <RouteCardHeader
          name={route.name}
          routeId={route.id}
          creatorUsername={route.creator?.username}
        />

        <RouteImage imageUrl={route.image_url} routeName={route.name} />

        <div className="p-4">
          <RouteStats
            routeId={route.id}
            initialLikesCount={routeStats?.likesCount || 0}
            initialAverageRating={routeStats?.averageRating}
            isLiked={!!userLike}
            onLikeClick={handleLikeClick}
          />
          
          <RouteCardContent
            duration={route.total_duration}
            attractionsCount={route.attractions?.length || 0}
            totalCost={route.attractions.reduce((sum, attraction) => sum + (attraction.price || 0), 0)}
            showSummary={showDescription}
            summary={route.description || ''}
          />

          <RouteScreenshot routeId={route.id} routeName={route.name} />

          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setShowComments(!showComments);
              }}
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Commenti
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
            <RouteDescription
              description={route.description || ''}
              isExpanded={showDescription}
              onToggle={() => setShowDescription(!showDescription)}
            />
          </div>
        </div>

        {showComments && (
          <div className="p-4 border-t" onClick={(e) => e.stopPropagation()}>
            <CommentSection routeId={route.id} />
          </div>
        )}
      </Card>

      <AttractionDetailsDialog
        isOpen={showAttractions}
        onClose={() => setShowAttractions(false)}
        attractions={route.attractions}
      />
    </>
  );
}
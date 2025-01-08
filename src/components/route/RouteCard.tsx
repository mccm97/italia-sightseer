import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { AttractionDetailsDialog } from './AttractionDetailsDialog';
import { RouteCardHeader } from './RouteCardHeader';
import { RouteCardContent } from './RouteCardContent';
import { CommentSection } from './CommentSection';
import { RouteDescription } from './RouteDescription';
import { RouteCardMedia } from './RouteCardMedia';
import { RouteCardActions } from './RouteCardActions';
import { RouteStats } from './RouteStats';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';

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
      const { data: existingLike } = await supabase
        .from('route_likes')
        .select('id')
        .eq('route_id', route.id)
        .eq('user_id', user.id)
        .maybeSingle();

      if (existingLike) {
        await supabase
          .from('route_likes')
          .delete()
          .eq('route_id', route.id)
          .eq('user_id', user.id);

        toast({
          title: "Mi piace rimosso",
          description: "Hai rimosso il mi piace dal percorso"
        });
      } else {
        await supabase
          .from('route_likes')
          .insert({
            route_id: route.id,
            user_id: user.id
          });

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
      <Card className="cursor-pointer hover:bg-gray-50 relative" onClick={onRouteClick}>
        <RouteCardHeader
          name={route.name}
          routeId={route.id}
          creatorUsername={route.creator?.username}
        />

        <RouteCardMedia
          routeId={route.id}
          routeName={route.name}
        />

        <div className="p-4">
          <RouteStats
            routeId={route.id}
            initialLikesCount={routeStats?.likesCount || 0}
            initialAverageRating={routeStats?.averageRating}
            onLikeClick={handleLikeClick}
          />
          
          <RouteCardContent
            duration={route.total_duration}
            attractionsCount={route.attractions?.length || 0}
            totalCost={route.attractions.reduce((sum, attraction) => sum + (attraction.price || 0), 0)}
            showSummary={showDescription}
            summary={route.description || ''}
          />

          <RouteCardActions
            onCommentsClick={() => setShowComments(!showComments)}
            onAttractionsClick={() => setShowAttractions(true)}
            onDescriptionToggle={() => setShowDescription(!showDescription)}
            showDescription={showDescription}
          />
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

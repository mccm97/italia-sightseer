import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '../ui/button';
import { AttractionDetailsDialog } from './AttractionDetailsDialog';
import { RouteCardHeader } from './RouteCardHeader';
import { RouteCardContent } from './RouteCardContent';
import { RouteStats } from './RouteStats';
import { CommentSection } from './CommentSection';
import { RouteDescription } from './RouteDescription';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

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
  const queryClient = useQueryClient();

  // Calculate total cost from attractions
  const totalCost = route.attractions.reduce((sum, attraction) => {
    return sum + (attraction.price || 0);
  }, 0);

  // Check if the current user has liked this route
  const { data: isLiked = false } = useQuery({
    queryKey: ['routeLike', route.id],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { data } = await supabase
        .from('route_likes')
        .select('id')
        .eq('route_id', route.id)
        .eq('user_id', user.id)
        .maybeSingle();

      return !!data;
    }
  });

  // Fetch comments
  const { data: comments = [] } = useQuery({
    queryKey: ['routeComments', route.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('route_comments')
        .select(`
          *,
          profiles:user_id (username)
        `)
        .eq('route_id', route.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  const handleLikeClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    try {
      if (isLiked) {
        await supabase
          .from('route_likes')
          .delete()
          .eq('route_id', route.id)
          .eq('user_id', user.id);
      } else {
        const { data: existingLike } = await supabase
          .from('route_likes')
          .select('id')
          .eq('route_id', route.id)
          .eq('user_id', user.id)
          .maybeSingle();

        if (!existingLike) {
          await supabase
            .from('route_likes')
            .insert({
              route_id: route.id,
              user_id: user.id
            });
        }
      }

      await queryClient.invalidateQueries({ queryKey: ['routeLike', route.id] });
      await queryClient.invalidateQueries({ queryKey: ['routeLikes', route.id] });
    } catch (error) {
      console.error('Error handling like:', error);
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

        {route.image_url && (
          <div className="w-full h-48 relative">
            <img 
              src={route.image_url} 
              alt={`Immagine del percorso ${route.name}`}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="p-4">
          <RouteStats
            routeId={route.id}
            initialLikesCount={routeStats?.likesCount || 0}
            initialAverageRating={routeStats?.averageRating}
            isLiked={isLiked}
            onLikeClick={handleLikeClick}
          />
          
          <RouteCardContent
            duration={route.total_duration}
            attractionsCount={route.attractions?.length || 0}
            totalCost={totalCost}
            showSummary={showDescription}
            summary={route.description || ''}
          />

          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setShowAttractions(true);
              }}
            >
              Dettagli Attrazioni
            </Button>
            <RouteDescription
              description={route.description || ''}
              isExpanded={showDescription}
              onToggle={() => setShowDescription(!showDescription)}
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setShowComments(!showComments);
              }}
            >
              Commenti
            </Button>
          </div>
        </div>

        {showComments && (
          <div className="p-4 border-t" onClick={(e) => e.stopPropagation()}>
            <CommentSection routeId={route.id} comments={comments} />
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
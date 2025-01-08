import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
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
    screenshot_url?: string;
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

  const handleCardClick = (e: React.MouseEvent) => {
    if (screenshot) {
      e.stopPropagation();
      // Show screenshot in modal
      // TODO: Implement screenshot modal
    } else {
      onRouteClick();
    }
  };

  return (
    <>
      <Card className="cursor-pointer hover:bg-gray-50 relative" onClick={handleCardClick}>
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
            showSummary={showDescription}
            summary={route.description || ''}
          />

          <div className="flex justify-end gap-2 mt-4">
            <RouteDescription
              description={route.description || ''}
              isExpanded={showDescription}
              onToggle={() => setShowDescription(!showDescription)}
            />
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
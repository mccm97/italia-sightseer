import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { AttractionDetailsDialog } from './AttractionDetailsDialog';
import { RouteCardContent } from './RouteCardContent';
import { CommentSection } from './CommentSection';
import { RouteStats } from './RouteStats';
import { RouteActions } from './RouteActions';
import { RouteHeaderWithImage } from './RouteHeaderWithImage';
import { RouteReviews } from './RouteReviews';
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
  const [showReviews, setShowReviews] = useState(false);

  const handleLikeClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

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
    } else {
      await supabase
        .from('route_likes')
        .insert({
          route_id: route.id,
          user_id: user.id
        });
    }
  };

  return (
    <>
      <Card className="relative">
        <RouteHeaderWithImage
          name={route.name}
          creatorUsername={route.creator?.username}
          imageUrl={route.image_url}
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

          <RouteActions
            onCommentsClick={() => setShowComments(!showComments)}
            onAttractionsClick={() => setShowAttractions(true)}
            onDescriptionToggle={() => setShowDescription(!showDescription)}
            onMapClick={onRouteClick}
            onReviewsClick={() => setShowReviews(!showReviews)}
            showDescription={showDescription}
          />

          {showComments && (
            <div className="mt-4 border-t pt-4" onClick={(e) => e.stopPropagation()}>
              <CommentSection routeId={route.id} />
            </div>
          )}

          {showReviews && (
            <div className="mt-4 border-t pt-4" onClick={(e) => e.stopPropagation()}>
              <RouteReviews routeId={route.id} />
            </div>
          )}
        </div>
      </Card>

      <AttractionDetailsDialog
        isOpen={showAttractions}
        onClose={() => setShowAttractions(false)}
        attractions={route.attractions}
      />
    </>
  );
}
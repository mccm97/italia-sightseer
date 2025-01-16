import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { AttractionDetailsDialog } from './AttractionDetailsDialog';
import { RouteCardContent } from './RouteCardContent';
import { CommentSection } from './CommentSection';
import { RouteStats } from './RouteStats';
import { RouteActions } from './RouteActions';
import { RouteHeaderWithImage } from './RouteHeaderWithImage';
import { RouteRating } from './RouteRating';
import { SaveRouteButton } from './SaveRouteButton';
import { RouteMapView } from './RouteMapView';
import { useLikeManagement } from '@/hooks/useLikeManagement';

interface RouteCardProps {
  route: {
    id: string;
    name: string;
    creator?: {
      id?: string;
      username: string;
      avatar_url?: string;
    };
    total_duration: number;
    attractions: Array<{
      name: string;
      visitDuration?: number;
      price?: number;
      position?: [number, number];
    }>;
    image_url?: string;
    description?: string;
    city_id?: string;
  };
  routeStats?: {
    likesCount: number;
    averageRating: number;
  };
  onRouteClick?: () => void;
  showDeleteButton?: boolean;
  currentUserId?: string | null;
  onRouteDelete?: () => void;
}

export function RouteCard({
  route,
  routeStats,
  onRouteClick,
  showDeleteButton = false,
  currentUserId,
  onRouteDelete,
}: RouteCardProps) {
  const [showAttractions, setShowAttractions] = useState(false);
  const [showDescription, setShowDescription] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showReviews, setShowReviews] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const { handleLike } = useLikeManagement();

  console.log('RouteCard - route attractions:', route.attractions);

  const handleLikeClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await handleLike(route.id);
  };

  return (
    <>
      <Card className="relative">
        <RouteHeaderWithImage
          name={route.name}
          creatorUsername={route.creator?.username}
          creatorId={route.creator?.id}
          creatorAvatarUrl={route.creator?.avatar_url}
          imageUrl={route.image_url}
        />

        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <RouteStats
              routeId={route.id}
              initialLikesCount={routeStats?.likesCount || 0}
              initialAverageRating={routeStats?.averageRating}
              onLikeClick={handleLikeClick}
            />
            <SaveRouteButton routeId={route.id} />
          </div>

          <RouteCardContent
            duration={route.total_duration}
            attractionsCount={route.attractions?.length || 0}
            totalCost={route.attractions.reduce((sum, attraction) => sum + (attraction.price || 0), 0)}
            showSummary={showDescription}
            summary={route.description || ''}
          />

          {showMap && (
            <RouteMapView 
              cityId={route.city_id}
              attractions={route.attractions || []}
            />
          )}

          <RouteActions
            onCommentsClick={() => setShowComments(!showComments)}
            onAttractionsClick={() => setShowAttractions(true)}
            onDescriptionToggle={() => setShowDescription(!showDescription)}
            onMapClick={() => setShowMap(!showMap)}
            onReviewsClick={() => setShowReviews(!showReviews)}
            showDescription={showDescription}
            showMap={showMap}
          />

          {showComments && (
            <div className="mt-4 border-t pt-4" onClick={(e) => e.stopPropagation()}>
              <CommentSection routeId={route.id} />
            </div>
          )}

          {showReviews && (
            <div className="mt-4 border-t pt-4" onClick={(e) => e.stopPropagation()}>
              <RouteRating routeId={route.id} initialRating={routeStats?.averageRating} />
            </div>
          )}
        </div>
      </Card>

      <AttractionDetailsDialog
        isOpen={showAttractions}
        onClose={() => setShowAttractions(false)}
        attractions={route.attractions || []}
      />
    </>
  );
}
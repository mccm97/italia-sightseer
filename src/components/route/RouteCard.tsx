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
import CityMap from '../CityMap';
import { toast } from '@/components/ui/use-toast';
import { useLikeManagement } from '@/hooks/useLikeManagement';

interface RouteCardProps {
  route: {
    id: string;
    name: string;
    creator?: {
      username: string;
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
}

export function RouteCard({
  route,
  routeStats,
  onRouteClick,
  showDeleteButton = false,
}: RouteCardProps) {
  const [showAttractions, setShowAttractions] = useState(false);
  const [showDescription, setShowDescription] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showReviews, setShowReviews] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [cityCoordinates, setCityCoordinates] = useState<[number, number] | null>(null);
  const { handleLike } = useLikeManagement();

  const handleMapClick = async () => {
    if (!route.city_id && !showMap) {
      toast({
        title: "Errore",
        description: "Impossibile caricare le coordinate della città",
        variant: "destructive"
      });
      return;
    }

    if (showMap) {
      setShowMap(false);
      return;
    }

    try {
      const { data: city } = await supabase
        .from('cities')
        .select('lat, lng')
        .eq('id', route.city_id)
        .single();

      if (city) {
        setCityCoordinates([city.lat, city.lng]);
        setShowMap(true);
      }
    } catch (error) {
      console.error('Error fetching city coordinates:', error);
      toast({
        title: "Errore",
        description: "Impossibile caricare le coordinate della città",
        variant: "destructive"
      });
    }
  };

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

          {showMap && cityCoordinates && (
            <div className="mt-4 h-[300px] rounded-lg overflow-hidden">
              <CityMap
                center={cityCoordinates}
                attractions={route.attractions}
                showWalkingPath={true}
              />
            </div>
          )}

          <RouteActions
            onCommentsClick={() => setShowComments(!showComments)}
            onAttractionsClick={() => setShowAttractions(true)}
            onDescriptionToggle={() => setShowDescription(!showDescription)}
            onMapClick={handleMapClick}
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
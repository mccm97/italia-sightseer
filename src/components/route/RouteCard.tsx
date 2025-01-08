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

  const handleMapClick = async () => {
    if (!route.city_id) return;

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
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Errore",
          description: "Devi essere autenticato per mettere mi piace",
          variant: "destructive"
        });
        return;
      }

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
        
        console.log('Like removed successfully');
      } else {
        const { error: insertError } = await supabase
          .from('route_likes')
          .insert({
            route_id: route.id,
            user_id: user.id
          });

        if (insertError) {
          console.error('Error inserting like:', insertError);
          if (insertError.code === '23505') {
            // If we get a duplicate error, we'll try to delete the like instead
            await supabase
              .from('route_likes')
              .delete()
              .eq('route_id', route.id)
              .eq('user_id', user.id);
          } else {
            throw insertError;
          }
        } else {
          console.log('Like added successfully');
        }
      }
    } catch (error) {
      console.error('Error handling like:', error);
      toast({
        title: "Errore",
        description: "Impossibile gestire il mi piace",
        variant: "destructive"
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
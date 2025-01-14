import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { AttractionDetailsDialog } from './AttractionDetailsDialog';
import { RouteCardContent } from './RouteCardContent';
import { CommentSection } from './CommentSection';
import { RouteStats } from './RouteStats';
import { RouteActions } from './RouteActions';
import { RouteHeaderWithImage } from './RouteHeaderWithImage';
import { supabase } from '@/integrations/supabase/client';
import CityMap from '../CityMap';
import { toast } from '@/components/ui/use-toast';
import { useLikeManagement } from '@/hooks/useLikeManagement';
import { Link } from 'react-router-dom';
import { RouteRating } from './RouteRating';
import { BookmarkPlus, BookmarkCheck } from 'lucide-react';
import { Button } from '../ui/button';
import { useQuery } from '@tanstack/react-query';

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

  const { data: isSaved, refetch: refetchSavedStatus } = useQuery({
    queryKey: ['routeSaved', route.id],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { data } = await supabase
        .from('saved_routes')
        .select('id')
        .eq('route_id', route.id)
        .eq('user_id', user.id)
        .maybeSingle();

      return !!data;
    },
  });

  const handleSave = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Errore",
          description: "Devi essere autenticato per salvare un percorso",
          variant: "destructive",
        });
        return;
      }

      if (isSaved) {
        // Remove from saved routes
        await supabase
          .from('saved_routes')
          .delete()
          .eq('route_id', route.id)
          .eq('user_id', user.id);

        toast({
          title: "Percorso rimosso",
          description: "Il percorso è stato rimosso dai preferiti",
        });
      } else {
        // Add to saved routes
        await supabase
          .from('saved_routes')
          .insert({
            route_id: route.id,
            user_id: user.id,
          });

        toast({
          title: "Percorso salvato",
          description: "Il percorso è stato aggiunto ai preferiti",
        });
      }

      refetchSavedStatus();
    } catch (error) {
      console.error('Error saving route:', error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante il salvataggio del percorso",
        variant: "destructive",
      });
    }
  };

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
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSave}
              className="ml-2"
            >
              {isSaved ? (
                <BookmarkCheck className="h-5 w-5 text-primary" />
              ) : (
                <BookmarkPlus className="h-5 w-5" />
              )}
            </Button>
          </div>

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
              <RouteRating routeId={route.id} initialRating={routeStats?.averageRating} />
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

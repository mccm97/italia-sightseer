import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '../ui/button';
import { ChevronDown } from 'lucide-react';
import { AttractionDetailsDialog } from './AttractionDetailsDialog';
import { RouteCardHeader } from './RouteCardHeader';
import { RouteCardContent } from './RouteCardContent';
import { RouteStats } from './RouteStats';
import { RouteComments } from './RouteComments';
import { RouteScreenshot } from './RouteScreenshot';
import { useQuery } from '@tanstack/react-query';
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
  const [isLoadingScreenshot, setIsLoadingScreenshot] = useState(true);
  const [screenshotUrl, setScreenshotUrl] = useState<string | null>(null);

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
        .maybeSingle(); // Changed from .single() to .maybeSingle()

      return !!data;
    }
  });

  const handleLikeClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    if (isLiked) {
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
      <Card className="cursor-pointer hover:bg-gray-50 relative" onClick={onRouteClick}>
        <RouteCardHeader
          name={route.name}
          routeId={route.id}
          creatorUsername={route.creator?.username}
        />
        
        <div className="absolute top-4 right-4 flex gap-2">
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
            Dettagli Attrazioni
          </Button>
        </div>

        <RouteScreenshot
          isLoading={isLoadingScreenshot}
          url={screenshotUrl}
          routeName={route.name}
        />

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
            showSummary={showSummary}
            summary=""
          />

          <div className="absolute bottom-4 right-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setShowSummary(!showSummary);
              }}
            >
              <span className="mr-2">Dettagli percorso</span>
              <ChevronDown className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {showSummary && (
          <div className="p-4 border-t">
            <RouteComments routeId={route.id} />
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
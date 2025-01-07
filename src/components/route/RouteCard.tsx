import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { generateSummary } from '@/services/summarization';
import { Attraction } from '@/types/route';
import { AttractionDetailsDialog } from './AttractionDetailsDialog';
import { RouteCardHeader } from './RouteCardHeader';
import { RouteCardContent } from './RouteCardContent';
import { RouteCardActions } from './RouteCardActions';
import { RouteScreenshot } from './RouteScreenshot';
import { RouteStats } from './RouteStats';
import { RouteReviews } from './RouteReviews';
import { Button } from '../ui/button';
import { ChevronDown } from 'lucide-react';

interface RouteCardProps {
  route: {
    id: string;
    name: string;
    creator?: {
      username: string;
    };
    total_duration: number;
    attractions: Attraction[];
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
  const [summary, setSummary] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [screenshotUrl, setScreenshotUrl] = useState<string | null>(null);
  const [isLoadingScreenshot, setIsLoadingScreenshot] = useState(true);
  const { toast } = useToast();

  // Calculate total cost from attractions
  const totalCost = route.attractions.reduce((sum, attraction) => {
    return sum + (attraction.price || 0);
  }, 0);

  useEffect(() => {
    const fetchScreenshot = async () => {
      try {
        const { data, error } = await supabase
          .from('screenshots')
          .select('screenshot_url')
          .eq('route_id', route.id)
          .maybeSingle();

        if (error) {
          console.error('Error fetching screenshot:', error);
          return;
        }

        if (data?.screenshot_url) {
          setScreenshotUrl(data.screenshot_url);
        }
      } catch (error) {
        console.error('Error in fetchScreenshot:', error);
      } finally {
        setIsLoadingScreenshot(false);
      }
    };

    fetchScreenshot();
  }, [route.id]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError) throw authError;
        setCurrentUser(user);
        
        if (user) {
          const { data, error } = await supabase
            .from('route_likes')
            .select('*')
            .eq('route_id', route.id)
            .eq('user_id', user.id)
            .maybeSingle();

          if (error && error.code !== 'PGRST116') {
            console.error('Error checking like status:', error);
            return;
          }

          setIsLiked(!!data);
        }
      } catch (error) {
        console.error('Auth check error:', error);
      }
    };

    checkAuth();
  }, [route.id]);

  const handleLikeClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!currentUser) {
      toast({
        title: "Accesso richiesto",
        description: "Devi essere autenticato per mettere mi piace",
        variant: "destructive"
      });
      return;
    }

    try {
      if (isLiked) {
        const { error } = await supabase
          .from('route_likes')
          .delete()
          .eq('route_id', route.id)
          .eq('user_id', currentUser.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('route_likes')
          .insert({
            route_id: route.id,
            user_id: currentUser.id
          });

        if (error) throw error;
      }
      setIsLiked(!isLiked);
    } catch (error) {
      console.error('Error toggling like:', error);
      toast({
        title: "Errore",
        description: "Impossibile aggiornare il mi piace",
        variant: "destructive"
      });
    }
  };

  const handleShowSummary = async () => {
    setShowSummary(!showSummary);
    if (!summary) {
      const generatedSummary = await generateSummary(route.attractions);
      setSummary(generatedSummary);
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
          
          <div className="mt-4 flex justify-center gap-4">
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
          
          <RouteCardContent
            duration={route.total_duration}
            attractionsCount={route.attractions?.length || 0}
            totalCost={totalCost}
            showSummary={showSummary}
            summary={summary}
          />

          <div className="absolute bottom-4 right-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleShowSummary();
              }}
            >
              <span className="mr-2">Dettagli percorso</span>
              <ChevronDown className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {showSummary && (
          <div className="p-4 border-t">
            <RouteReviews routeId={route.id} />
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
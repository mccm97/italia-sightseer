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
import { Skeleton } from '@/components/ui/skeleton';

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
  const [likesCount, setLikesCount] = useState(routeStats?.likesCount || 0);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [screenshotUrl, setScreenshotUrl] = useState<string | null>(null);
  const [isLoadingScreenshot, setIsLoadingScreenshot] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchScreenshot = async () => {
      try {
        console.log('Fetching screenshot for route:', route.id);
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
          console.log('Found screenshot URL:', data.screenshot_url);
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
        setLikesCount(prev => prev - 1);
      } else {
        const { error } = await supabase
          .from('route_likes')
          .insert({
            route_id: route.id,
            user_id: currentUser.id
          });

        if (error) throw error;
        setLikesCount(prev => prev + 1);
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

  const totalCost = route.attractions?.reduce((sum: number, attr: any) => sum + (attr.price || 0), 0);

  return (
    <>
      <Card className="cursor-pointer hover:bg-gray-50" onClick={onRouteClick}>
        <RouteCardHeader
          name={route.name}
          creatorUsername={route.creator?.username}
          isLiked={isLiked}
          likesCount={likesCount}
          averageRating={routeStats?.averageRating}
          onLikeClick={handleLikeClick}
        />
        
        {isLoadingScreenshot ? (
          <div className="w-full h-48">
            <Skeleton className="w-full h-full" />
          </div>
        ) : screenshotUrl ? (
          <div className="w-full h-48 relative">
            <img 
              src={screenshotUrl} 
              alt={`Screenshot del percorso ${route.name}`}
              className="w-full h-full object-cover"
            />
          </div>
        ) : null}

        <RouteCardActions
          onDirectionsClick={onDirectionsClick}
          onAttractionsClick={() => setShowAttractions(true)}
          onSummaryClick={handleShowSummary}
        />
        <RouteCardContent
          duration={route.total_duration}
          attractionsCount={route.attractions?.length || 0}
          totalCost={totalCost}
          showSummary={showSummary}
          summary={summary}
        />
      </Card>

      <AttractionDetailsDialog
        isOpen={showAttractions}
        onClose={() => setShowAttractions(false)}
        attractions={route.attractions}
      />
    </>
  );
}
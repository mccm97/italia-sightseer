import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { AttractionDetailsDialog } from './AttractionDetailsDialog';
import { RouteCardHeader } from './RouteCardHeader';
import { RouteCardContent } from './RouteCardContent';
import { RouteRating } from './RouteRating';
import { CommentSection } from './CommentSection';
import { RouteDescription } from './RouteDescription';
import { Button } from '../ui/button';
import { MessageSquare, ListTree } from 'lucide-react';
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

  const totalCost = route.attractions.reduce((sum, attraction) => {
    return sum + (attraction.price || 0);
  }, 0);

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
          <div className="flex items-center gap-4 mb-4">
            <RouteRating
              routeId={route.id}
              initialRating={routeStats?.averageRating}
            />
          </div>
          
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
                setShowComments(!showComments);
              }}
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Commenti
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setShowAttractions(true);
              }}
            >
              <ListTree className="w-4 h-4 mr-2" />
              Dettagli Attrazioni
            </Button>
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
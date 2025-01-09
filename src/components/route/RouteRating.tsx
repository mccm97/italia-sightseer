import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "../ui/scroll-area";
import { Star } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { useToast } from "@/hooks/use-toast";

interface RouteRatingProps {
  routeId: string;
  initialRating?: number;
}

export function RouteRating({ routeId, initialRating }: RouteRatingProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: reviews, isLoading } = useQuery({
    queryKey: ['routeReviews', routeId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('route_ratings')
        .select(`
          rating,
          created_at,
          profiles (
            username,
            avatar_url
          )
        `)
        .eq('route_id', routeId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  // Check if user has already rated
  const { data: userRating } = useQuery({
    queryKey: ['userRating', routeId],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('route_ratings')
        .select('rating')
        .eq('route_id', routeId)
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      return data?.rating;
    }
  });

  const handleSubmitReview = async () => {
    if (rating === 0) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Errore",
          description: "Devi essere autenticato per lasciare una recensione",
          variant: "destructive"
        });
        return;
      }

      const { error } = await supabase
        .from('route_ratings')
        .upsert({
          route_id: routeId,
          rating: rating,
          user_id: user.id
        });

      if (error) throw error;

      toast({
        title: "Successo",
        description: "Recensione inviata con successo"
      });

      queryClient.invalidateQueries({ queryKey: ['routeReviews', routeId] });
      queryClient.invalidateQueries({ queryKey: ['userRating', routeId] });
    } catch (error) {
      console.error('Error submitting review:', error);
      toast({
        title: "Errore",
        description: "Impossibile inviare la recensione",
        variant: "destructive"
      });
    }
  };

  if (isLoading) return <div>Caricamento recensioni...</div>;

  return (
    <div className="space-y-4">
      {!userRating && (
        <div className="flex flex-col items-center gap-2 p-4 border rounded">
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-6 h-6 cursor-pointer ${
                  star <= (hoveredRating || rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                }`}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
              />
            ))}
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleSubmitReview}
            disabled={rating === 0}
          >
            Invia Recensione
          </Button>
        </div>
      )}

      <ScrollArea className="h-[200px]">
        <div className="space-y-4">
          {!reviews?.length ? (
            <div>Nessuna recensione</div>
          ) : (
            reviews.map((review, index) => (
              <div key={index} className="flex items-start gap-2 p-2 border rounded">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{review.profiles?.username || 'Utente anonimo'}</span>
                    <div className="flex">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(review.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
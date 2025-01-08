import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "../ui/scroll-area";
import { Star } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";

interface RouteReviewsProps {
  routeId: string;
}

export function RouteReviews({ routeId }: RouteReviewsProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const queryClient = useQueryClient();

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

  const handleSubmitReview = async () => {
    if (rating === 0) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('route_ratings')
      .insert({
        route_id: routeId,
        rating: rating,
        user_id: user.id
      });

    if (!error) {
      setRating(0);
      queryClient.invalidateQueries({ queryKey: ['routeReviews', routeId] });
    }
  };

  if (isLoading) return <div>Caricamento recensioni...</div>;

  return (
    <div className="space-y-4">
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
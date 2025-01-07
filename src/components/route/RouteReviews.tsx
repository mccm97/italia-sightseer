import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "../ui/scroll-area";
import { Star } from "lucide-react";

interface RouteReviewsProps {
  routeId: string;
}

export function RouteReviews({ routeId }: RouteReviewsProps) {
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

  if (isLoading) return <div>Caricamento recensioni...</div>;
  if (!reviews?.length) return <div>Nessuna recensione</div>;

  return (
    <ScrollArea className="h-[200px]">
      <div className="space-y-4">
        {reviews.map((review, index) => (
          <div key={index} className="flex items-start gap-2 p-2 border rounded">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium">{review.profiles?.username || 'Utente anonimo'}</span>
                <div className="flex">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400" />
                  ))}
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                {new Date(review.created_at).toLocaleDateString()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
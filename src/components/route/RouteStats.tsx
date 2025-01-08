import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Star, ThumbsUp } from "lucide-react";
import { Button } from "../ui/button";

interface RouteStatsProps {
  routeId: string;
  initialLikesCount: number;
  initialAverageRating?: number;
  isLiked: boolean;
  onLikeClick: (e: React.MouseEvent) => void;
}

export function RouteStats({ 
  routeId, 
  initialLikesCount,
  initialAverageRating,
  isLiked,
  onLikeClick 
}: RouteStatsProps) {
  // Fetch real-time likes count
  const { data: likesCount = initialLikesCount } = useQuery({
    queryKey: ['routeLikes', routeId],
    queryFn: async () => {
      console.log('Fetching likes count for route:', routeId);
      const { count, error } = await supabase
        .from('route_likes')
        .select('*', { count: 'exact', head: true })
        .eq('route_id', routeId);
      
      if (error) throw error;
      return count || 0;
    }
  });

  // Fetch real-time average rating
  const { data: averageRating = initialAverageRating } = useQuery({
    queryKey: ['routeRating', routeId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('route_ratings')
        .select('rating')
        .eq('route_id', routeId);
      
      if (error) throw error;
      
      if (!data?.length) return 0;
      
      const average = data.reduce((acc, curr) => acc + curr.rating, 0) / data.length;
      return Number(average.toFixed(1));
    }
  });

  return (
    <div className="flex items-center gap-4">
      <Button
        variant="ghost"
        size="sm"
        onClick={onLikeClick}
        className={`flex items-center gap-1 ${isLiked ? 'text-red-500' : ''}`}
      >
        <ThumbsUp className="w-4 h-4" />
        <span>{likesCount}</span>
      </Button>
      <div className="flex items-center gap-1">
        <Star className="w-4 h-4 text-yellow-400" />
        <span>{averageRating?.toFixed(1) || '0.0'}</span>
      </div>
    </div>
  );
}
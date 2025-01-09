import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Star, ThumbsUp } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

interface RouteStatsProps {
  routeId: string;
  initialLikesCount: number;
  initialAverageRating?: number;
  onLikeClick: (e: React.MouseEvent) => void;
}

export function RouteStats({ 
  routeId, 
  initialLikesCount,
  initialAverageRating,
  onLikeClick 
}: RouteStatsProps) {
  const queryClient = useQueryClient();

  // Fetch real-time likes count
  const { data: likesCount = initialLikesCount } = useQuery({
    queryKey: ['routeLikes', routeId],
    queryFn: async () => {
      console.log('Fetching likes count for route:', routeId);
      const { count, error } = await supabase
        .from('route_likes')
        .select('*', { count: 'exact', head: true })
        .eq('route_id', routeId);
      
      if (error) {
        console.error('Error fetching likes count:', error);
        throw error;
      }
      return count || 0;
    },
    initialData: initialLikesCount
  });

  // Fetch current user's like status
  const { data: isLiked = false } = useQuery({
    queryKey: ['routeLike', routeId],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { data, error } = await supabase
        .from('route_likes')
        .select('id')
        .eq('route_id', routeId)
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching like status:', error);
        throw error;
      }
      return !!data;
    }
  });

  const handleLikeClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Optimistically update UI
    queryClient.setQueryData(['routeLike', routeId], !isLiked);
    queryClient.setQueryData(
      ['routeLikes', routeId], 
      (old: number) => isLiked ? (old - 1) : (old + 1)
    );
    
    // Call the provided click handler
    await onLikeClick(e);
  };

  return (
    <div className="flex items-center gap-4">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleLikeClick}
        className={cn(
          "flex items-center gap-1",
          isLiked && "text-red-500 hover:text-red-600"
        )}
      >
        <ThumbsUp className={cn("w-4 h-4", isLiked && "fill-current")} />
        <span>{likesCount}</span>
      </Button>
      <div className="flex items-center gap-1">
        <Star className="w-4 h-4 text-yellow-400" />
        <span>{initialAverageRating?.toFixed(1) || '0.0'}</span>
      </div>
    </div>
  );
}
import React from 'react';
import { Star } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface RouteRatingProps {
  routeId: string;
  initialRating?: number;
}

export function RouteRating({ routeId, initialRating = 0 }: RouteRatingProps) {
  const [isRatingOpen, setIsRatingOpen] = React.useState(false);
  const [selectedRating, setSelectedRating] = React.useState(0);
  const queryClient = useQueryClient();

  const { data: averageRating = initialRating } = useQuery({
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

  const handleRatingSubmit = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event from bubbling up
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    try {
      const { error } = await supabase
        .from('route_ratings')
        .upsert({
          route_id: routeId,
          user_id: user.id,
          rating: selectedRating
        });

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ['routeRating', routeId] });
      setIsRatingOpen(false);
    } catch (error) {
      console.error('Error submitting rating:', error);
    }
  };

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={(e) => {
          e.stopPropagation(); // Prevent event from bubbling up
          setIsRatingOpen(true);
        }}
        className="flex items-center gap-1"
      >
        <Star className="w-4 h-4 text-yellow-400" />
        <span>{averageRating.toFixed(1)}</span>
      </Button>

      <Dialog open={isRatingOpen} onOpenChange={(open) => {
        setIsRatingOpen(open);
      }}>
        <DialogContent onClick={(e) => e.stopPropagation()}> {/* Prevent dialog clicks from bubbling */}
          <DialogHeader>
            <DialogTitle>Valuta questo percorso</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4">
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <Star
                  key={rating}
                  className={`w-8 h-8 cursor-pointer ${
                    rating <= selectedRating ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent event from bubbling up
                    setSelectedRating(rating);
                  }}
                />
              ))}
            </div>
            <Button onClick={handleRatingSubmit}>Invia valutazione</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
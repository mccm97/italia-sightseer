import React from 'react';
import { Star } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface RouteRatingProps {
  routeId: string;
  initialRating?: number;
}

export function RouteRating({ routeId, initialRating = 0 }: RouteRatingProps) {
  const [isRatingOpen, setIsRatingOpen] = React.useState(false);
  const [selectedRating, setSelectedRating] = React.useState(0);
  const queryClient = useQueryClient();
  const { toast } = useToast();

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
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Errore",
          description: "Devi essere autenticato per lasciare una valutazione",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('route_ratings')
        .upsert(
          {
            route_id: routeId,
            user_id: user.id,
            rating: selectedRating
          },
          {
            onConflict: 'route_id,user_id',
            ignoreDuplicates: false
          }
        );

      if (error) {
        console.error('Error submitting rating:', error);
        toast({
          title: "Errore",
          description: "Si è verificato un errore durante l'invio della valutazione",
          variant: "destructive",
        });
        return;
      }

      await queryClient.invalidateQueries({ queryKey: ['routeRating', routeId] });
      setIsRatingOpen(false);
      toast({
        title: "Successo",
        description: "La tua valutazione è stata registrata con successo",
      });
    } catch (error) {
      console.error('Error submitting rating:', error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante l'invio della valutazione",
        variant: "destructive",
      });
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
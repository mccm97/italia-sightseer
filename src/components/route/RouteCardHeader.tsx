import { CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ThumbsUp, Star } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';

interface RouteCardHeaderProps {
  name: string;
  routeId: string;
  creatorUsername?: string;
  isLiked: boolean;
  likesCount: number;
  averageRating?: number;
  onLikeClick: (e: React.MouseEvent) => void;
}

export function RouteCardHeader({
  name,
  routeId,
  creatorUsername,
  isLiked,
  likesCount,
  averageRating,
  onLikeClick
}: RouteCardHeaderProps) {
  const [showRatingDialog, setShowRatingDialog] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);
  const [comment, setComment] = useState('');
  const { toast } = useToast();

  const handleRatingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      console.log('Submitting rating for route:', routeId);
      
      // First, try to upsert the rating
      const { error: ratingError } = await supabase
        .from('route_ratings')
        .upsert({
          route_id: routeId,
          rating: selectedRating
        }, {
          onConflict: 'route_id,user_id'
        });

      if (ratingError) throw ratingError;

      // If there's a comment, insert it
      if (comment.trim()) {
        const { error: commentError } = await supabase
          .from('route_comments')
          .insert({
            route_id: routeId,
            content: comment.trim()
          });

        if (commentError) throw commentError;
      }

      toast({
        title: "Recensione salvata",
        description: "Grazie per aver recensito questo percorso!",
      });
      setShowRatingDialog(false);
      setComment('');
      setSelectedRating(0);
    } catch (error) {
      console.error('Error submitting review:', error);
      toast({
        title: "Errore",
        description: "Impossibile salvare la recensione. Riprova più tardi.",
        variant: "destructive"
      });
    }
  };

  const handleRatingClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowRatingDialog(true);
  };

  return (
    <>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <div className="flex flex-col">
            <span>{name}</span>
            <span className="text-sm text-muted-foreground">
              Creato da: {creatorUsername || 'Utente anonimo'}
            </span>
          </div>
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
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRatingClick}
              className="flex items-center gap-1"
            >
              <Star className="w-4 h-4 text-yellow-400" />
              <span>{averageRating?.toFixed(1) || '0.0'}</span>
            </Button>
          </div>
        </CardTitle>
      </CardHeader>

      <Dialog open={showRatingDialog} onOpenChange={setShowRatingDialog}>
        <DialogContent onClick={e => e.stopPropagation()}>
          <DialogHeader>
            <DialogTitle>Recensisci questo percorso</DialogTitle>
            <DialogDescription>
              Seleziona un punteggio e lascia un commento opzionale
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleRatingSubmit} className="space-y-4">
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <Button
                  key={rating}
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedRating(rating);
                  }}
                  className={`p-2 ${selectedRating >= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                >
                  <Star className="w-6 h-6" />
                </Button>
              ))}
            </div>
            <div className="space-y-2">
              <label htmlFor="comment" className="text-sm font-medium">
                Commento (opzionale)
              </label>
              <Textarea
                id="comment"
                placeholder="Scrivi qui il tuo commento..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                onClick={e => e.stopPropagation()}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={(e) => {
                  e.stopPropagation();
                  setShowRatingDialog(false);
                }}
              >
                Annulla
              </Button>
              <Button 
                type="submit" 
                disabled={selectedRating === 0}
              >
                Salva recensione
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
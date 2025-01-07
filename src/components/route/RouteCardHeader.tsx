import { CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ThumbsUp, Star } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();

  const handleRatingSubmit = async () => {
    try {
      const { error } = await supabase
        .from('route_ratings')
        .upsert({
          route_id: routeId,
          rating: selectedRating
        });

      if (error) throw error;

      toast({
        title: "Recensione salvata",
        description: "Grazie per aver recensito questo percorso!",
      });
      setShowRatingDialog(false);
    } catch (error) {
      console.error('Error submitting rating:', error);
      toast({
        title: "Errore",
        description: "Impossibile salvare la recensione. Riprova più tardi.",
        variant: "destructive"
      });
    }
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
              onClick={() => setShowRatingDialog(true)}
              className="flex items-center gap-1"
            >
              <Star className="w-4 h-4 text-yellow-400" />
              <span>{averageRating?.toFixed(1) || '0.0'}</span>
            </Button>
          </div>
        </CardTitle>
      </CardHeader>

      <Dialog open={showRatingDialog} onOpenChange={setShowRatingDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Valuta questo percorso</DialogTitle>
            <DialogDescription>
              Seleziona un punteggio da 1 a 5 stelle
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <Button
                  key={rating}
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedRating(rating)}
                  className={`p-2 ${selectedRating >= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                >
                  <Star className="w-6 h-6" />
                </Button>
              ))}
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowRatingDialog(false)}>
                Annulla
              </Button>
              <Button onClick={handleRatingSubmit} disabled={selectedRating === 0}>
                Salva recensione
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Star } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

interface RatingCategory {
  name: string;
  key: string;
  label: string;
}

const ratingCategories: RatingCategory[] = [
  { name: 'cleanliness', key: 'cleanliness', label: 'Pulizia' },
  { name: 'safety', key: 'safety', label: 'Sicurezza' },
  { name: 'transportation', key: 'transportation', label: 'Trasporti' },
  { name: 'food_quality', key: 'food_quality', label: 'Qualità del Cibo' },
  { name: 'cultural_attractions', key: 'cultural_attractions', label: 'Attrazioni Culturali' },
  { name: 'nightlife', key: 'nightlife', label: 'Vita Notturna' },
  { name: 'cost_of_living', key: 'cost_of_living', label: 'Costo della Vita' },
];

interface CityRatingsProps {
  cityId: string;
  userId?: string;
}

export function CityRatings({ cityId, userId }: CityRatingsProps) {
  const { toast } = useToast();
  const [ratings, setRatings] = useState<Record<string, number>>(() => 
    Object.fromEntries(ratingCategories.map(cat => [cat.name, 3]))
  );
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: existingRating, isLoading: isLoadingRating } = useQuery({
    queryKey: ['cityRating', cityId, userId],
    queryFn: async () => {
      if (!userId) return null;
      const { data, error } = await supabase
        .from('city_ratings')
        .select('*')
        .eq('city_id', cityId)
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Error fetching rating:', error);
        return null;
      }

      return data;
    },
    enabled: !!userId && !!cityId,
  });

  const { data: allRatings, isLoading: isLoadingAllRatings } = useQuery({
    queryKey: ['cityRatings', cityId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('city_ratings')
        .select('*')
        .eq('city_id', cityId);

      if (error) {
        console.error('Error fetching ratings:', error);
        return [];
      }

      return data;
    },
  });

  const handleRatingChange = (category: string, value: number) => {
    setRatings(prev => ({ ...prev, [category]: value }));
  };

  const handleSubmit = async () => {
    if (!userId) {
      toast({
        title: "Errore",
        description: "Devi effettuare l'accesso per lasciare una recensione",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const ratingData = {
        city_id: cityId,
        user_id: userId,
        ...ratings,
        comment,
      };

      const { error } = existingRating
        ? await supabase
            .from('city_ratings')
            .update(ratingData)
            .eq('id', existingRating.id)
        : await supabase
            .from('city_ratings')
            .insert([ratingData]);

      if (error) throw error;

      toast({
        title: "Successo",
        description: "La tua recensione è stata salvata",
      });
    } catch (error) {
      console.error('Error submitting rating:', error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore nel salvare la recensione",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingRating || isLoadingAllRatings) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const averageRatings = allRatings?.length
    ? ratingCategories.reduce((acc, category) => {
        acc[category.name] = Math.round(
          allRatings.reduce((sum, rating) => sum + rating[category.name], 0) / allRatings.length
        );
        return acc;
      }, {} as Record<string, number>)
    : null;

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">La tua Recensione</h3>
          {ratingCategories.map(category => (
            <div key={category.key} className="space-y-2">
              <div className="flex justify-between items-center">
                <span>{category.label}</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map(value => (
                    <button
                      key={value}
                      onClick={() => handleRatingChange(category.name, value)}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`h-5 w-5 ${
                          value <= ratings[category.name]
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
          <div className="space-y-2">
            <label className="block text-sm font-medium">Commento</label>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Scrivi un commento sulla tua esperienza..."
              className="min-h-[100px]"
            />
          </div>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !userId}
            className="w-full"
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            {existingRating ? 'Aggiorna Recensione' : 'Pubblica Recensione'}
          </Button>
        </div>

        {averageRatings && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Media Recensioni</h3>
            {ratingCategories.map(category => (
              <div key={category.key} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span>{category.label}</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(value => (
                      <Star
                        key={value}
                        className={`h-5 w-5 ${
                          value <= averageRatings[category.name]
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
            <p className="text-sm text-gray-500 mt-2">
              Basato su {allRatings.length} recensioni
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export function useLikeManagement() {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleLike = async (routeId: string) => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Errore",
          description: "Devi essere autenticato per mettere mi piace",
          variant: "destructive"
        });
        return;
      }

      // First check if the like exists
      const { data: existingLike, error: checkError } = await supabase
        .from('route_likes')
        .select('id')
        .eq('route_id', routeId)
        .eq('user_id', user.id)
        .maybeSingle();

      if (checkError) {
        console.error('Error checking like status:', checkError);
        throw checkError;
      }

      if (existingLike) {
        // Remove like
        const { error: deleteError } = await supabase
          .from('route_likes')
          .delete()
          .eq('route_id', routeId)
          .eq('user_id', user.id);

        if (deleteError) {
          console.error('Error removing like:', deleteError);
          throw deleteError;
        }
        
        console.log('Like removed successfully');
      } else {
        // Add like
        const { error: insertError } = await supabase
          .from('route_likes')
          .insert({
            route_id: routeId,
            user_id: user.id
          });

        if (insertError) {
          console.error('Error adding like:', insertError);
          throw insertError;
        }
        
        console.log('Like added successfully');
      }
    } catch (error) {
      console.error('Error handling like:', error);
      toast({
        title: "Errore",
        description: "Impossibile gestire il mi piace",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return { handleLike, isProcessing };
}
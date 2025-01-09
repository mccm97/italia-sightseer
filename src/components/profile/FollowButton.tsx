import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { UserPlus, UserMinus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface FollowButtonProps {
  profileId: string;
  currentUserId: string | undefined;
}

export function FollowButton({ profileId, currentUserId }: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (currentUserId) {
      checkIfFollowing();
    }
  }, [currentUserId, profileId]);

  const checkIfFollowing = async () => {
    try {
      const { data } = await supabase
        .from('user_follows')
        .select('id')
        .eq('follower_id', currentUserId)
        .eq('following_id', profileId)
        .maybeSingle();
      
      setIsFollowing(!!data);
    } catch (error) {
      console.error('Error checking follow status:', error);
    }
  };

  const handleFollow = async () => {
    if (!currentUserId) {
      toast({
        title: "Errore",
        description: "Devi essere autenticato per seguire altri utenti",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      if (isFollowing) {
        // Unfollow
        await supabase
          .from('user_follows')
          .delete()
          .eq('follower_id', currentUserId)
          .eq('following_id', profileId);
        
        toast({
          description: "Hai smesso di seguire questo utente",
        });
      } else {
        // Follow
        await supabase
          .from('user_follows')
          .insert({
            follower_id: currentUserId,
            following_id: profileId,
          });
        
        toast({
          description: "Hai iniziato a seguire questo utente",
        });
      }
      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error('Error toggling follow:', error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (currentUserId === profileId) return null;

  return (
    <Button
      variant={isFollowing ? "outline" : "default"}
      onClick={handleFollow}
      disabled={isLoading}
      className="ml-auto"
    >
      {isFollowing ? (
        <>
          <UserMinus className="h-4 w-4 mr-2" />
          Non seguire più
        </>
      ) : (
        <>
          <UserPlus className="h-4 w-4 mr-2" />
          Segui
        </>
      )}
    </Button>
  );
}
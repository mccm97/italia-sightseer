import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { UserCog, Award, Medal, Crown } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { FollowButton } from './FollowButton';

interface ProfileHeaderProps {
  username: string | null;
  avatarUrl: string | null;
  bio: string | null;
  onEditClick: () => void;
  userId: string;
  subscriptionLevel: 'bronze' | 'silver' | 'gold';
}

const SubscriptionIcon = ({ level }: { level: 'bronze' | 'silver' | 'gold' }) => {
  switch (level) {
    case 'gold':
      return <Crown className="h-5 w-5 text-yellow-500" />;
    case 'silver':
      return <Medal className="h-5 w-5 text-gray-400" />;
    case 'bronze':
      return <Award className="h-5 w-5 text-amber-700" />;
  }
};

export function ProfileHeader({ username, avatarUrl, bio, onEditClick, userId, subscriptionLevel }: ProfileHeaderProps) {
  const { data: stats, isLoading: isLoadingStats } = useQuery({
    queryKey: ['profileStats', userId],
    queryFn: async () => {
      console.log('Fetching profile stats for user:', userId);
      
      // First, get all routes for this user
      const { data: userRoutes, error: routesError } = await supabase
        .from('routes')
        .select('id')
        .eq('user_id', userId);

      if (routesError) throw routesError;
      
      if (!userRoutes?.length) {
        console.log('No routes found for user');
        return { totalLikes: 0, averageRating: '0.0' };
      }

      const routeIds = userRoutes.map(route => route.id);

      // Fetch total likes
      const { data: likes, error: likesError } = await supabase
        .from('route_likes')
        .select('id')
        .in('route_id', routeIds);

      if (likesError) throw likesError;

      // Fetch average ratings
      const { data: ratings, error: ratingsError } = await supabase
        .from('route_ratings')
        .select('rating')
        .in('route_id', routeIds);

      if (ratingsError) throw ratingsError;

      const totalLikes = likes?.length || 0;
      const averageRating = ratings?.length 
        ? (ratings.reduce((acc, curr) => acc + curr.rating, 0) / ratings.length).toFixed(1)
        : '0.0';

      return {
        totalLikes,
        averageRating
      };
    }
  });

  const { data: followStats, isLoading: isLoadingFollowStats } = useQuery({
    queryKey: ['followStats', userId],
    queryFn: async () => {
      const [followers, following] = await Promise.all([
        supabase
          .from('user_follows')
          .select('id')
          .eq('following_id', userId),
        supabase
          .from('user_follows')
          .select('id')
          .eq('follower_id', userId)
      ]);

      return {
        followers: followers.data?.length || 0,
        following: following.data?.length || 0
      };
    }
  });

  const { data: currentUser } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={avatarUrl || undefined} />
            <AvatarFallback>{username?.[0]?.toUpperCase() || '?'}</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">{username || 'Utente'}</h1>
              <SubscriptionIcon level={subscriptionLevel} />
            </div>
            {bio && <p className="text-muted-foreground">{bio}</p>}
            <div className="flex gap-4 mt-2">
              {isLoadingStats ? (
                <>
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-6 w-24" />
                </>
              ) : (
                <>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">{stats?.totalLikes}</span> Mi piace
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">{stats?.averageRating}</span> Media recensioni
                  </p>
                </>
              )}
              {isLoadingFollowStats ? (
                <>
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-6 w-24" />
                </>
              ) : (
                <>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">{followStats?.followers}</span> Follower
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">{followStats?.following}</span> Seguiti
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          {currentUser?.id === userId ? (
            <Button variant="outline" onClick={onEditClick}>
              <UserCog className="mr-2 h-4 w-4" />
              Modifica Profilo
            </Button>
          ) : (
            <FollowButton profileId={userId} currentUserId={currentUser?.id} />
          )}
        </div>
      </div>
    </div>
  );
}
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Medal } from 'lucide-react';
import { FollowButton } from './FollowButton';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useLogout } from '@/hooks/useLogout';
import { useTranslation } from 'react-i18next';

interface ProfileHeaderProps {
  username?: string | null;
  avatarUrl?: string | null;
  bio?: string | null;
  onEditClick?: () => void;
  profileId?: string;
  currentUserId?: string;
  subscriptionLevel?: string;
  showEditButton?: boolean;
}

export function ProfileHeader({
  username,
  avatarUrl,
  bio,
  onEditClick,
  profileId,
  currentUserId,
  subscriptionLevel = 'bronze',
  showEditButton = false,
}: ProfileHeaderProps) {
  const { t } = useTranslation();
  
  const getSubscriptionColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'gold':
        return '#FFD700';
      case 'silver':
        return '#C0C0C0';
      default:
        return '#CD7F32'; // bronze
    }
  };

  // Fetch profile stats
  const { data: stats } = useQuery({
    queryKey: ['profileStats', profileId],
    queryFn: async () => {
      if (!profileId) return null;

      // Get route likes
      const { data: routeLikes } = await supabase
        .from('route_likes')
        .select('id', { count: 'exact' })
        .eq('user_id', profileId);

      // Get average ratings
      const { data: ratings } = await supabase
        .from('route_ratings')
        .select('rating')
        .eq('user_id', profileId);

      const averageRating = ratings?.length 
        ? ratings.reduce((acc, curr) => acc + curr.rating, 0) / ratings.length 
        : 0;

      // Get followers count
      const { data: followers } = await supabase
        .from('user_follows')
        .select('id', { count: 'exact' })
        .eq('following_id', profileId);

      // Get following count
      const { data: following } = await supabase
        .from('user_follows')
        .select('id', { count: 'exact' })
        .eq('follower_id', profileId);

      return {
        likes: routeLikes?.length || 0,
        averageRating: Number(averageRating.toFixed(1)),
        followers: followers?.length || 0,
        following: following?.length || 0
      };
    },
    enabled: !!profileId
  });

  const { handleLogout } = useLogout();

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={avatarUrl || undefined} />
            <AvatarFallback>{username?.[0]?.toUpperCase() || '?'}</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-2xl font-bold">{username || t('profile.anonymous')}</h2>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Medal 
                      className="h-6 w-6" 
                      style={{ color: getSubscriptionColor(subscriptionLevel) }}
                      aria-label={`Level ${subscriptionLevel.charAt(0).toUpperCase() + subscriptionLevel.slice(1)}`}
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Level {subscriptionLevel.charAt(0).toUpperCase() + subscriptionLevel.slice(1)}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            {bio && <p className="text-muted-foreground mt-1">{bio}</p>}
            <div className="flex space-x-4 mt-2 text-sm text-muted-foreground">
              <span>{stats?.likes || 0} {t('profile.likes')}</span>
              <span>{stats?.averageRating || 0} {t('profile.avgRating')}</span>
              <span>{stats?.followers || 0} {t('profile.followers')}</span>
              <span>{stats?.following || 0} {t('profile.following')}</span>
            </div>
          </div>
        </div>
        <div className="flex space-x-2">
          {showEditButton && (
            <Button onClick={onEditClick} variant="outline">
              {t('profile.edit')}
            </Button>
          )}
          {profileId && currentUserId && profileId !== currentUserId ? (
            <FollowButton profileId={profileId} currentUserId={currentUserId} />
          ) : showEditButton && (
            <Button 
              variant="outline" 
              onClick={handleLogout}
              className="text-red-500 hover:text-red-600"
            >
              Logout
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
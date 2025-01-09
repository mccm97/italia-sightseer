import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Medal } from 'lucide-react';
import { FollowButton } from './FollowButton';

interface ProfileHeaderProps {
  username?: string | null;
  avatarUrl?: string | null;
  bio?: string | null;
  onEditClick?: () => void;
  userId?: string;
  subscriptionLevel?: string;
  showEditButton?: boolean;
}

export function ProfileHeader({
  username,
  avatarUrl,
  bio,
  onEditClick,
  userId,
  subscriptionLevel = 'bronze',
  showEditButton = false,
}: ProfileHeaderProps) {
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
              <h2 className="text-2xl font-bold">{username || 'Utente Anonimo'}</h2>
              <Medal 
                className="h-6 w-6" 
                style={{ color: getSubscriptionColor(subscriptionLevel) }}
                title={`Livello ${subscriptionLevel.charAt(0).toUpperCase() + subscriptionLevel.slice(1)}`}
              />
            </div>
            {bio && <p className="text-muted-foreground mt-1">{bio}</p>}
          </div>
        </div>
        <div className="flex space-x-2">
          {showEditButton && (
            <Button onClick={onEditClick} variant="outline">
              Modifica Profilo
            </Button>
          )}
          {userId && !showEditButton && (
            <FollowButton userId={userId} />
          )}
        </div>
      </div>
    </div>
  );
}
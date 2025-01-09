import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';

interface ProfileHeaderProps {
  username: string | null;
  avatarUrl: string | null;
  bio: string | null;
  onEditClick: () => void;
  userId: string;
  subscriptionLevel: string;
  showEditButton?: boolean;
}

export function ProfileHeader({
  username,
  avatarUrl,
  bio,
  onEditClick,
  userId,
  subscriptionLevel,
  showEditButton = true
}: ProfileHeaderProps) {
  return (
    <div className="flex flex-col items-center text-center">
      <Avatar className="h-24 w-24 mb-4">
        <AvatarImage src={avatarUrl || undefined} />
        <AvatarFallback>{username?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
      </Avatar>
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">{username || 'Utente anonimo'}</h2>
        {bio && <p className="text-gray-600">{bio}</p>}
        <p className="text-sm text-gray-500">
          Livello abbonamento: {subscriptionLevel.charAt(0).toUpperCase() + subscriptionLevel.slice(1)}
        </p>
        {showEditButton && (
          <Button
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={onEditClick}
          >
            <Edit className="h-4 w-4 mr-2" />
            Modifica profilo
          </Button>
        )}
      </div>
    </div>
  );
}
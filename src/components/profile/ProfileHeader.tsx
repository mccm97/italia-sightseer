import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { UserCog } from 'lucide-react';

interface ProfileHeaderProps {
  username: string | null;
  avatarUrl: string | null;
  bio: string | null;
  onEditClick: () => void;
}

export function ProfileHeader({ username, avatarUrl, bio, onEditClick }: ProfileHeaderProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={avatarUrl || undefined} />
            <AvatarFallback>{username?.[0]?.toUpperCase() || '?'}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">{username || 'Utente'}</h1>
            {bio && <p className="text-muted-foreground">{bio}</p>}
          </div>
        </div>
        <Button variant="outline" onClick={onEditClick}>
          <UserCog className="mr-2 h-4 w-4" />
          Modifica Profilo
        </Button>
      </div>
    </div>
  );
}

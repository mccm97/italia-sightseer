import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDate } from '@/lib/utils';

interface BlogPostHeaderProps {
  userId: string;
  username: string | null;
  avatarUrl: string | null;
  title: string;
  createdAt: string;
}

export function BlogPostHeader({ userId, username, avatarUrl, title, createdAt }: BlogPostHeaderProps) {
  console.log('BlogPostHeader - Rendering for user:', { userId, username });
  
  return (
    <div className="flex flex-row items-center gap-4">
      <Link 
        to={`/profile/${userId}`} 
        className="hover:opacity-80 transition-opacity"
        onClick={(e) => {
          e.stopPropagation();
          console.log('BlogPostHeader - Avatar clicked, navigating to profile:', userId);
        }}
      >
        <Avatar>
          <AvatarImage src={avatarUrl || undefined} />
          <AvatarFallback>
            {username?.[0]?.toUpperCase() || 'U'}
          </AvatarFallback>
        </Avatar>
      </Link>
      <div>
        <h2 className="text-2xl font-bold">{title}</h2>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Link 
            to={`/profile/${userId}`}
            className="hover:underline hover:text-gray-700 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              console.log('BlogPostHeader - Username clicked, navigating to profile:', userId);
            }}
          >
            {username || 'Utente anonimo'}
          </Link>
          <span>•</span>
          <span>{formatDate(createdAt)}</span>
        </div>
      </div>
    </div>
  );
}
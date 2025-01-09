import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { formatDate } from '@/lib/utils';

interface BlogPostProps {
  post: {
    id: string;
    title: string;
    content: string;
    created_at: string;
    cover_image_url: string | null;
    profiles: {
      username: string | null;
      avatar_url: string | null;
    } | null;
  };
}

export function BlogPost({ post }: BlogPostProps) {
  return (
    <Card className="overflow-hidden">
      {post.cover_image_url && (
        <div className="w-full h-64 relative">
          <img
            src={post.cover_image_url}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar>
          <AvatarImage src={post.profiles?.avatar_url || undefined} />
          <AvatarFallback>
            {post.profiles?.username?.[0]?.toUpperCase() || 'U'}
          </AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-2xl font-bold">{post.title}</h2>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>{post.profiles?.username || 'Utente anonimo'}</span>
            <span>•</span>
            <span>{formatDate(post.created_at)}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="whitespace-pre-wrap">{post.content}</p>
      </CardContent>
    </Card>
  );
}
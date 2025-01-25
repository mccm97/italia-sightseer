import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { BlogPostHeader } from './BlogPostHeader';
import { BlogPostActions } from './BlogPostActions';

export interface BlogPostContentProps {
  post: {
    id: string;
    title: string;
    content: string;
    created_at: string;
    cover_image_url: string | null;
    user_id: string;
    profiles: {
      username: string | null;
      avatar_url: string | null;
    } | null;
  };
  currentUser: string | null;
  likes: number;
  isLiked: boolean;
  isLoading: boolean;
  onLike: () => Promise<void>;
  onShare: (platform: string) => void;
  onDelete?: () => Promise<void>;
  onUpdate?: (title: string, content: string) => Promise<void>;
}

export function BlogPostContent({ 
  post, 
  currentUser,
  likes, 
  isLiked, 
  isLoading, 
  onLike, 
  onShare,
  onDelete,
  onUpdate
}: BlogPostContentProps) {
  return (
    <Card className="mb-8">
      {post.cover_image_url && (
        <div className="w-full h-64 relative">
          <img
            src={post.cover_image_url}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <CardHeader>
        <BlogPostHeader
          userId={post.user_id}
          username={post.profiles?.username}
          avatarUrl={post.profiles?.avatar_url}
          title={post.title}
          createdAt={post.created_at}
        />
      </CardHeader>
      <CardContent>
        <p className="whitespace-pre-wrap mb-6">{post.content}</p>
        <BlogPostActions
          postId={post.id}
          postTitle={post.title}
          postContent={post.content}
          coverImageUrl={post.cover_image_url || ''}
          likes={likes}
          isLiked={isLiked}
          isLoading={isLoading}
          onLike={onLike}
          onShare={onShare}
          onDelete={onDelete}
          onUpdate={onUpdate}
          currentUserId={currentUser}
          authorId={post.user_id}
        />
      </CardContent>
    </Card>
  );
}
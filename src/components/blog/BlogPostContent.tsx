import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { BlogPostHeader } from './BlogPostHeader';
import { BlogPostActions } from './BlogPostActions';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Pencil, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface BlogPostContentProps {
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
  onDelete: () => Promise<void>;
  onUpdate: (title: string, content: string) => Promise<void>;
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
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(post.title);
  const [editedContent, setEditedContent] = useState(post.content);
  const { toast } = useToast();

  const handleUpdate = async () => {
    await onUpdate(editedTitle, editedContent);
    setIsEditing(false);
  };

  // Create a truncated version of the content for sharing
  const shareDescription = post.content.length > 140 
    ? post.content.substring(0, 137) + '...'
    : post.content;

  // Get the absolute URL for the cover image
  const absoluteCoverImageUrl = post.cover_image_url 
    ? new URL(post.cover_image_url, window.location.origin).toString()
    : '';

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
      <CardHeader>
        <div className="flex justify-between items-start">
          <BlogPostHeader
            userId={post.user_id}
            username={post.profiles?.username}
            avatarUrl={post.profiles?.avatar_url}
            title={isEditing ? '' : post.title}
            createdAt={post.created_at}
          />
          {currentUser === post.user_id && (
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsEditing(!isEditing)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Sei sicuro?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Questa azione non può essere annullata. Il post verrà eliminato permanentemente.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Annulla</AlertDialogCancel>
                    <AlertDialogAction onClick={onDelete}>
                      Elimina
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-4">
            <Input
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              placeholder="Titolo del post"
            />
            <Textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              placeholder="Contenuto del post"
              className="min-h-[200px]"
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Annulla
              </Button>
              <Button onClick={handleUpdate}>
                Salva modifiche
              </Button>
            </div>
          </div>
        ) : (
          <>
            <p className="whitespace-pre-wrap mb-6">{post.content}</p>
            <BlogPostActions
              postId={post.id}
              postTitle={post.title}
              postContent={shareDescription}
              coverImageUrl={absoluteCoverImageUrl}
              likes={likes}
              isLiked={isLiked}
              isLoading={isLoading}
              onLike={onLike}
              onShare={onShare}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
}
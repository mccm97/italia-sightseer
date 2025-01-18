import { useState } from 'react';
import { CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { BlogPostActions } from './BlogPostActions';

interface BlogPostContentProps {
  content: string;
  title: string;
  isEditing: boolean;
  editedTitle: string;
  editedContent: string;
  setEditedTitle: (title: string) => void;
  setEditedContent: (content: string) => void;
  setIsEditing: (isEditing: boolean) => void;
  handleUpdate: () => Promise<void>;
  handleShare: (platform: string) => void;
  handleLike: () => Promise<void>;
  likes: number;
  isLiked: boolean;
  isLoading: boolean;
  postId: string;
  coverImageUrl: string;
}

export function BlogPostContent({
  content,
  title,
  isEditing,
  editedTitle,
  editedContent,
  setEditedTitle,
  setEditedContent,
  setIsEditing,
  handleUpdate,
  handleShare,
  handleLike,
  likes,
  isLiked,
  isLoading,
  postId,
  coverImageUrl,
}: BlogPostContentProps) {
  // Create a truncated version of the content for sharing
  const shareDescription = content.length > 140 
    ? content.substring(0, 137) + '...'
    : content;

  return (
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
          <p className="whitespace-pre-wrap mb-6">{content}</p>
          <BlogPostActions
            postId={postId}
            postTitle={title}
            postContent={shareDescription}
            coverImageUrl={coverImageUrl}
            likes={likes}
            isLiked={isLiked}
            isLoading={isLoading}
            onLike={handleLike}
            onShare={handleShare}
          />
        </>
      )}
    </CardContent>
  );
}
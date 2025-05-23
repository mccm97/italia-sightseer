
import { Button } from "@/components/ui/button";
import { Heart, Share2, Trash, Edit } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useTranslation } from "react-i18next";

interface BlogPostActionsProps {
  postId: string;
  postTitle: string;
  postContent: string;
  coverImageUrl: string;
  likes: number;
  isLiked: boolean;
  isLoading: boolean;
  currentUserId: string | null;
  authorId: string;
  onLike: () => Promise<void>;
  onShare: (platform: string) => void;
  onDelete?: () => Promise<void>;
  onUpdate?: (title: string, content: string) => Promise<void>;
}

export function BlogPostActions({
  postId,
  postTitle,
  postContent,
  likes,
  isLiked,
  isLoading,
  currentUserId,
  authorId,
  onLike,
  onShare,
  onDelete,
  onUpdate
}: BlogPostActionsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(postTitle);
  const [editContent, setEditContent] = useState(postContent);
  const [isSaving, setIsSaving] = useState(false);
  const { t } = useTranslation();

  const handleUpdate = async () => {
    if (!onUpdate) return;
    setIsSaving(true);
    try {
      await onUpdate(editTitle, editContent);
      setIsEditing(false);
    } finally {
      setIsSaving(false);
    }
  };

  const isAuthor = currentUserId === authorId;

  return (
    <div className="flex items-center gap-4">
      <Button 
        variant="ghost" 
        size="sm"
        onClick={onLike}
        disabled={isLoading}
      >
        <Heart className={`h-5 w-5 mr-1 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
        {likes}
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => onShare('facebook')}
      >
        <Share2 className="h-5 w-5 mr-1" />
        {t('blog.share')}
      </Button>

      {isAuthor && (
        <>
          <Dialog open={isEditing} onOpenChange={setIsEditing}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm">
                <Edit className="h-5 w-5 mr-1" />
                {t('blog.edit')}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t('blog.edit')}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder={t('blog.writePost.title')}
                />
                <Textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  placeholder={t('blog.writePost.content')}
                  className="min-h-[200px]"
                />
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    {t('common.cancel')}
                  </Button>
                  <Button onClick={handleUpdate} disabled={isSaving}>
                    {isSaving ? t('common.saving') : t('common.save')}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {onDelete && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onDelete}
            >
              <Trash className="h-5 w-5 mr-1" />
              {t('blog.delete')}
            </Button>
          )}
        </>
      )}
    </div>
  );
}

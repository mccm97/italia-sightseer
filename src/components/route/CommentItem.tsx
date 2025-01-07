import { useState } from 'react';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Trash2, MessageCircle } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { ImageUpload } from '../ImageUpload';

interface CommentItemProps {
  comment: any;
  currentUserId?: string;
  onDelete: (commentId: string) => void;
  onReply: (commentId: string, content: string, imageUrl?: string) => void;
}

export function CommentItem({ comment, currentUserId, onDelete, onReply }: CommentItemProps) {
  const [replyContent, setReplyContent] = useState('');
  const [isReplying, setIsReplying] = useState(false);
  const [replyImageUrl, setReplyImageUrl] = useState('');

  const handleReply = () => {
    onReply(comment.id, replyContent, replyImageUrl);
    setReplyContent('');
    setReplyImageUrl('');
    setIsReplying(false);
  };

  return (
    <div className="border rounded-lg p-4 space-y-2">
      <div className="flex items-center justify-between">
        <span className="font-medium">{comment.profiles?.username || 'Utente anonimo'}</span>
        {currentUserId === comment.user_id && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(comment.id)}
          >
            <Trash2 className="w-4 h-4 text-red-500" />
          </Button>
        )}
      </div>
      
      <p className="text-sm text-muted-foreground">
        {formatDate(comment.created_at)}
      </p>
      <p>{comment.content}</p>
      
      {comment.image_url && (
        <div className="mt-2">
          <img 
            src={comment.image_url} 
            alt="Comment image" 
            className="max-w-full h-auto rounded-lg"
          />
        </div>
      )}
      
      <div className="mt-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsReplying(!isReplying)}
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          Rispondi
        </Button>
      </div>

      {isReplying && (
        <div className="mt-2 space-y-2">
          <Textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="Scrivi una risposta..."
          />
          <ImageUpload
            bucketName="comment-images"
            onImageUploaded={setReplyImageUrl}
            currentImage={replyImageUrl}
            className="mt-2"
          />
          <div className="flex gap-2">
            <Button size="sm" onClick={handleReply}>
              Invia risposta
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setIsReplying(false);
                setReplyContent('');
                setReplyImageUrl('');
              }}
            >
              Annulla
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
import { useState } from 'react';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Trash2, MessageCircle } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface CommentItemProps {
  comment: any;
  currentUserId?: string;
  onDelete: (commentId: string) => void;
  onReply: (commentId: string, content: string) => void;
}

export function CommentItem({ comment, currentUserId, onDelete, onReply }: CommentItemProps) {
  const [replyContent, setReplyContent] = useState('');
  const [isReplying, setIsReplying] = useState(false);

  const handleReply = () => {
    onReply(comment.id, replyContent);
    setReplyContent('');
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
import { useState } from 'react';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Trash2, MessageCircle, Pencil } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { ImageUpload } from '../ImageUpload';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

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
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const { toast } = useToast();

  const handleReply = () => {
    onReply(comment.id, replyContent, replyImageUrl);
    setReplyContent('');
    setReplyImageUrl('');
    setIsReplying(false);
  };

  const handleUpdate = async () => {
    try {
      const { error } = await supabase
        .from('route_comments')
        .update({ content: editedContent })
        .eq('id', comment.id);

      if (error) throw error;

      toast({
        title: "Commento aggiornato",
        description: "Il commento è stato aggiornato con successo",
      });

      comment.content = editedContent;
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating comment:', error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante l'aggiornamento del commento",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="border rounded-lg p-4 space-y-2">
      <div className="flex items-center justify-between">
        <span className="font-medium">{comment.profiles?.username || 'Utente anonimo'}</span>
        {currentUserId === comment.user_id && (
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsEditing(!isEditing)}
            >
              <Pencil className="w-4 h-4" />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Sei sicuro?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Questa azione non può essere annullata. Il commento verrà eliminato permanentemente.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annulla</AlertDialogCancel>
                  <AlertDialogAction onClick={() => onDelete(comment.id)}>
                    Elimina
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </div>
      
      <p className="text-sm text-muted-foreground">
        {formatDate(comment.created_at)}
      </p>

      {isEditing ? (
        <div className="space-y-2">
          <Textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="min-h-[100px]"
          />
          <div className="flex gap-2">
            <Button size="sm" onClick={handleUpdate}>
              Salva modifiche
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setIsEditing(false);
                setEditedContent(comment.content);
              }}
            >
              Annulla
            </Button>
          </div>
        </div>
      ) : (
        <p>{comment.content}</p>
      )}
      
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
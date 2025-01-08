import { useState } from 'react';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';

interface CommentSectionProps {
  routeId: string;
  comments: any[];
}

export function CommentSection({ routeId, comments }: CommentSectionProps) {
  const [newComment, setNewComment] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;

    try {
      const { error } = await supabase
        .from('route_comments')
        .insert({ route_id: routeId, content: newComment });

      if (error) throw error;

      setNewComment('');
      await queryClient.invalidateQueries({ queryKey: ['routeComments', routeId] });

      toast({
        title: "Commento pubblicato",
        description: "Il tuo commento è stato pubblicato con successo",
      });
    } catch (error) {
      console.error('Error posting comment:', error);
      toast({
        title: "Errore",
        description: "Impossibile pubblicare il commento",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="p-4 border rounded-lg space-y-4">
        <Textarea
          placeholder="Scrivi un commento..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="min-h-[100px]"
        />
        <Button 
          onClick={handleSubmitComment}
          className="w-full"
        >
          Pubblica
        </Button>
      </div>
      
      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="p-4 border rounded-lg space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-semibold">
                {comment.profiles?.username || 'Utente anonimo'}
              </span>
              <span className="text-sm text-muted-foreground">
                {new Date(comment.created_at).toLocaleDateString()}
              </span>
            </div>
            <p>{comment.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
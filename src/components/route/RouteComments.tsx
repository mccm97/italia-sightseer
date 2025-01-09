import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ScrollArea } from '../ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { CommentItem } from './CommentItem';

interface RouteCommentsProps {
  routeId: string;
}

export function RouteComments({ routeId }: RouteCommentsProps) {
  const { toast } = useToast();

  const { data: comments = [], refetch } = useQuery({
    queryKey: ['routeComments', routeId],
    queryFn: async () => {
      console.log('Fetching comments for route:', routeId);
      const { data, error } = await supabase
        .from('route_comments')
        .select(`
          *,
          profiles:user_id (username, avatar_url),
          replies:route_comments!reply_to_id(
            *,
            profiles:user_id (username, avatar_url)
          )
        `)
        .eq('route_id', routeId)
        .is('reply_to_id', null)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    }
  });

  const { data: currentUser } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    }
  });

  const handleDeleteComment = async (commentId: string) => {
    try {
      // First delete any replies to this comment
      const { error: repliesError } = await supabase
        .from('route_comments')
        .delete()
        .eq('reply_to_id', commentId);

      if (repliesError) throw repliesError;

      // Then delete the comment itself
      const { error } = await supabase
        .from('route_comments')
        .delete()
        .eq('id', commentId);

      if (error) throw error;

      toast({
        title: "Commento eliminato",
        description: "Il commento è stato eliminato con successo",
      });
      refetch();
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast({
        title: "Errore",
        description: "Impossibile eliminare il commento",
        variant: "destructive"
      });
    }
  };

  const handleReply = async (commentId: string, content: string, imageUrl?: string) => {
    if (!content.trim()) return;

    try {
      const { error } = await supabase
        .from('route_comments')
        .insert({
          route_id: routeId,
          content: content,
          reply_to_id: commentId,
          image_url: imageUrl
        });

      if (error) throw error;

      toast({
        title: "Risposta inviata",
        description: "La tua risposta è stata pubblicata con successo",
      });
      refetch();
    } catch (error) {
      console.error('Error posting reply:', error);
      toast({
        title: "Errore",
        description: "Impossibile pubblicare la risposta",
        variant: "destructive"
      });
    }
  };

  return (
    <ScrollArea className="h-[300px]">
      <div className="space-y-4 p-4">
        {comments.map((comment: any) => (
          <div key={comment.id}>
            <CommentItem
              comment={comment}
              currentUserId={currentUser?.id}
              onDelete={handleDeleteComment}
              onReply={handleReply}
            />
            
            {comment.replies && comment.replies.length > 0 && (
              <div className="ml-8 mt-4 space-y-4">
                {comment.replies.map((reply: any) => (
                  <CommentItem
                    key={reply.id}
                    comment={reply}
                    currentUserId={currentUser?.id}
                    onDelete={handleDeleteComment}
                    onReply={handleReply}
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
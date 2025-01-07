import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ScrollArea } from '../ui/scroll-area';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Star, Trash2, MessageCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface RouteCommentsProps {
  routeId: string;
}

export function RouteComments({ routeId }: RouteCommentsProps) {
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
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
          route_ratings!left (rating),
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

  const handleDeleteComment = async (commentId: string) => {
    try {
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

  const handleReply = async (commentId: string) => {
    if (!replyContent.trim()) return;

    try {
      const { error } = await supabase
        .from('route_comments')
        .insert({
          route_id: routeId,
          content: replyContent,
          reply_to_id: commentId
        });

      if (error) throw error;

      toast({
        title: "Risposta inviata",
        description: "La tua risposta è stata pubblicata con successo",
      });
      setReplyTo(null);
      setReplyContent('');
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

  const { data: currentUser } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    }
  });

  return (
    <ScrollArea className="h-[300px]">
      <div className="space-y-4 p-4">
        {comments.map((comment: any) => (
          <div key={comment.id} className="border rounded-lg p-4 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-medium">{comment.profiles?.username || 'Utente anonimo'}</span>
                {comment.route_ratings?.[0]?.rating && (
                  <div className="flex">
                    {[...Array(comment.route_ratings[0].rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400" />
                    ))}
                  </div>
                )}
              </div>
              {currentUser?.id === comment.user_id && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteComment(comment.id)}
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {new Date(comment.created_at).toLocaleDateString()}
            </p>
            <p>{comment.content}</p>
            
            <div className="mt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Rispondi
              </Button>
            </div>

            {replyTo === comment.id && (
              <div className="mt-2 space-y-2">
                <Textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Scrivi una risposta..."
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => handleReply(comment.id)}>
                    Invia risposta
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setReplyTo(null);
                      setReplyContent('');
                    }}
                  >
                    Annulla
                  </Button>
                </div>
              </div>
            )}

            {comment.replies && comment.replies.length > 0 && (
              <div className="ml-8 mt-4 space-y-4">
                {comment.replies.map((reply: any) => (
                  <div key={reply.id} className="border-l-2 pl-4 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{reply.profiles?.username || 'Utente anonimo'}</span>
                      {currentUser?.id === reply.user_id && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteComment(reply.id)}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {new Date(reply.created_at).toLocaleDateString()}
                    </p>
                    <p>{reply.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
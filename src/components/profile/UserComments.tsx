import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { MessageSquare } from 'lucide-react';

interface UserCommentsProps {
  userId: string;
}

export function UserComments({ userId }: UserCommentsProps) {
  const { data: comments, isLoading } = useQuery({
    queryKey: ['userComments', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('route_comments')
        .select(`
          *,
          routes (name)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  if (isLoading) return <div>Caricamento commenti...</div>;

  if (!comments?.length) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <MessageSquare className="mx-auto h-12 w-12 mb-4" />
        <p>Non hai ancora lasciato alcun commento</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <div key={comment.id} className="p-4 border rounded-lg">
          <p className="text-sm text-muted-foreground mb-2">
            Su: {comment.routes?.name}
          </p>
          <p>{comment.content}</p>
          <p className="text-sm text-muted-foreground mt-2">
            {new Date(comment.created_at).toLocaleDateString('it-IT')}
          </p>
        </div>
      ))}
    </div>
  );
}
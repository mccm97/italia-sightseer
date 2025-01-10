import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { MessageSquare, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface UserCommentsProps {
  userId: string;
}

export function UserComments({ userId }: UserCommentsProps) {
  const { toast } = useToast();
  const { data: comments, isLoading, refetch } = useQuery({
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

  const handleDelete = async (commentId: string) => {
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
        description: "Si è verificato un errore durante l'eliminazione del commento",
        variant: "destructive",
      });
    }
  };

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
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                Su: {comment.routes?.name}
              </p>
              <p>{comment.content}</p>
              <p className="text-sm text-muted-foreground mt-2">
                {new Date(comment.created_at).toLocaleDateString('it-IT')}
              </p>
            </div>
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
                    Questa azione non può essere annullata. Il commento verrà eliminato permanentemente.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annulla</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleDelete(comment.id)}>
                    Elimina
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      ))}
    </div>
  );
}
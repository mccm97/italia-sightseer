import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { BookOpen, Trash2 } from 'lucide-react';
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

interface UserBlogPostsProps {
  userId: string;
}

export function UserBlogPosts({ userId }: UserBlogPostsProps) {
  const { toast } = useToast();
  const { data: posts, isLoading, refetch } = useQuery({
    queryKey: ['userBlogPosts', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('user_id', userId)
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  const handleDelete = async (postId: string) => {
    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', postId);

      if (error) throw error;

      toast({
        title: "Post eliminato",
        description: "Il post è stato eliminato con successo",
      });
      
      refetch();
    } catch (error) {
      console.error('Error deleting post:', error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante l'eliminazione del post",
        variant: "destructive",
      });
    }
  };

  if (isLoading) return <div>Caricamento post...</div>;

  if (!posts?.length) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <BookOpen className="mx-auto h-12 w-12 mb-4" />
        <p>Non hai ancora pubblicato alcun post</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <div key={post.id} className="p-4 border rounded-lg">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-lg mb-2">{post.title}</h3>
              <p className="line-clamp-3">{post.content}</p>
              <p className="text-sm text-muted-foreground mt-2">
                {new Date(post.created_at).toLocaleDateString('it-IT')}
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
                    Questa azione non può essere annullata. Il post verrà eliminato permanentemente.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annulla</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleDelete(post.id)}>
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
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { BlogPostHeader } from './BlogPostHeader';
import { BlogPostActions } from './BlogPostActions';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Pencil, Trash2 } from 'lucide-react';

interface BlogPostProps {
  post: {
    id: string;
    title: string;
    content: string;
    created_at: string;
    cover_image_url: string | null;
    user_id: string;
    profiles: {
      username: string | null;
      avatar_url: string | null;
    } | null;
  };
}

export function BlogPost({ post }: BlogPostProps) {
  const [likes, setLikes] = useState<number>(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(post.title);
  const [editedContent, setEditedContent] = useState(post.content);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchLikes();
    checkIfLiked();
    checkCurrentUser();
  }, [post.id]);

  const checkCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setCurrentUser(user?.id || null);
  };

  const fetchLikes = async () => {
    const { count } = await supabase
      .from('blog_post_likes')
      .select('*', { count: 'exact' })
      .eq('post_id', post.id);
    
    setLikes(count || 0);
  };

  const checkIfLiked = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('blog_post_likes')
      .select('id')
      .eq('post_id', post.id)
      .eq('user_id', user.id)
      .maybeSingle();

    setIsLiked(!!data);
  };

  const handleLike = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Errore",
          description: "Devi essere autenticato per mettere mi piace",
          variant: "destructive",
        });
        return;
      }

      if (isLiked) {
        await supabase
          .from('blog_post_likes')
          .delete()
          .eq('post_id', post.id)
          .eq('user_id', user.id);
        setLikes(prev => prev - 1);
      } else {
        await supabase
          .from('blog_post_likes')
          .insert({
            post_id: post.id,
            user_id: user.id
          });
        setLikes(prev => prev + 1);
      }
      setIsLiked(!isLiked);
    } catch (error) {
      console.error('Error handling like:', error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const text = encodeURIComponent(post.title);
    
    const shareUrls = {
      whatsapp: `https://wa.me/?text=${text}%20${url}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      twitter: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`
    };

    window.open(shareUrls[platform as keyof typeof shareUrls], '_blank');
  };

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', post.id);

      if (error) throw error;

      toast({
        title: "Post eliminato",
        description: "Il post è stato eliminato con successo",
      });

      // Ricarica la pagina per aggiornare la lista dei post
      window.location.reload();
    } catch (error) {
      console.error('Error deleting post:', error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante l'eliminazione del post",
        variant: "destructive",
      });
    }
  };

  const handleUpdate = async () => {
    try {
      const { error } = await supabase
        .from('blog_posts')
        .update({
          title: editedTitle,
          content: editedContent
        })
        .eq('id', post.id);

      if (error) throw error;

      toast({
        title: "Post aggiornato",
        description: "Il post è stato aggiornato con successo",
      });

      setIsEditing(false);
    } catch (error) {
      console.error('Error updating post:', error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante l'aggiornamento del post",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="overflow-hidden">
      {post.cover_image_url && (
        <div className="w-full h-64 relative">
          <img
            src={post.cover_image_url}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <CardHeader>
        <div className="flex justify-between items-start">
          <BlogPostHeader
            userId={post.user_id}
            username={post.profiles?.username}
            avatarUrl={post.profiles?.avatar_url}
            title={isEditing ? '' : post.title}
            createdAt={post.created_at}
          />
          {currentUser === post.user_id && (
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsEditing(!isEditing)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
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
                    <AlertDialogAction onClick={handleDelete}>
                      Elimina
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-4">
            <Input
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              placeholder="Titolo del post"
            />
            <Textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              placeholder="Contenuto del post"
              className="min-h-[200px]"
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Annulla
              </Button>
              <Button onClick={handleUpdate}>
                Salva modifiche
              </Button>
            </div>
          </div>
        ) : (
          <>
            <p className="whitespace-pre-wrap mb-6">{post.content}</p>
            <BlogPostActions
              postId={post.id}
              likes={likes}
              isLiked={isLiked}
              isLoading={isLoading}
              onLike={handleLike}
              onShare={handleShare}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
}
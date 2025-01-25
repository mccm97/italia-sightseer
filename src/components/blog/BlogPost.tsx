import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { BlogPostContent } from './BlogPostContent';

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
    try {
      const { count } = await supabase
        .from('blog_post_likes')
        .select('*', { count: 'exact' })
        .eq('post_id', post.id);
      
      setLikes(count || 0);
    } catch (error) {
      console.error('Error fetching likes:', error);
    }
  };

  const checkIfLiked = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    try {
      const { data } = await supabase
        .from('blog_post_likes')
        .select('id')
        .eq('post_id', post.id)
        .eq('user_id', user.id)
        .maybeSingle();

      setIsLiked(!!data);
    } catch (error) {
      console.error('Error checking like status:', error);
    }
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

  const handleUpdate = async (title: string, content: string) => {
    try {
      const { error } = await supabase
        .from('blog_posts')
        .update({
          title,
          content
        })
        .eq('id', post.id);

      if (error) throw error;

      toast({
        title: "Post aggiornato",
        description: "Il post è stato aggiornato con successo",
      });
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
    <BlogPostContent
      post={post}
      currentUser={currentUser}
      likes={likes}
      isLiked={isLiked}
      isLoading={isLoading}
      onLike={handleLike}
      onShare={handleShare}
      onDelete={handleDelete}
      onUpdate={handleUpdate}
    />
  );
}
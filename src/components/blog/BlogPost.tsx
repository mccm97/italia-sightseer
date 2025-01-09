import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { BlogPostHeader } from './BlogPostHeader';
import { BlogPostActions } from './BlogPostActions';

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
  const { toast } = useToast();

  useEffect(() => {
    fetchLikes();
    checkIfLiked();
  }, [post.id]);

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

  console.log('BlogPost - Rendering post for user:', post.user_id);

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
        <BlogPostHeader
          userId={post.user_id}
          username={post.profiles?.username}
          avatarUrl={post.profiles?.avatar_url}
          title={post.title}
          createdAt={post.created_at}
        />
      </CardHeader>
      <CardContent>
        <p className="whitespace-pre-wrap mb-6">{post.content}</p>
        <BlogPostActions
          postId={post.id}
          likes={likes}
          isLiked={isLiked}
          isLoading={isLoading}
          onLike={handleLike}
          onShare={handleShare}
        />
      </CardContent>
    </Card>
  );
}
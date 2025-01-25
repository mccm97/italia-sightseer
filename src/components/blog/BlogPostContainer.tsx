import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { BlogPostMeta } from './BlogPostMeta';
import { BlogPostContent } from './BlogPostContent';
import { BlogComments } from './BlogComments';
import { MainMenu } from '@/components/MainMenu';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';

export function BlogPostContainer() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<any[]>([]);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isLikeLoading, setIsLikeLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    checkCurrentUser();
    fetchPost();
    fetchComments();
    fetchLikes();
  }, [postId]);

  const checkCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setCurrentUser(user?.id || null);
  };

  const fetchPost = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select(`
          *,
          profiles:user_id (
            username,
            avatar_url
          )
        `)
        .eq('id', postId)
        .single();

      if (error) throw error;
      setPost(data);
    } catch (error) {
      console.error('Error fetching post:', error);
      toast({
        title: "Errore",
        description: "Impossibile caricare il post",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_comments')
        .select(`
          *,
          profiles:user_id (
            username,
            avatar_url
          )
        `)
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setComments(data || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const fetchLikes = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { count } = await supabase
        .from('blog_post_likes')
        .select('id', { count: 'exact' })
        .eq('post_id', postId);
      
      setLikes(count || 0);

      if (user) {
        const { data } = await supabase
          .from('blog_post_likes')
          .select('id')
          .eq('post_id', postId)
          .eq('user_id', user.id)
          .maybeSingle();
        
        setIsLiked(!!data);
      }
    } catch (error) {
      console.error('Error fetching likes:', error);
    }
  };

  const handleLike = async () => {
    setIsLikeLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Errore",
          description: "Devi essere autenticato per mettere mi piace",
          variant: "destructive"
        });
        return;
      }

      if (isLiked) {
        await supabase
          .from('blog_post_likes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', user.id);
        setLikes(prev => prev - 1);
        setIsLiked(false);
      } else {
        await supabase
          .from('blog_post_likes')
          .insert({
            post_id: postId,
            user_id: user.id
          });
        setLikes(prev => prev + 1);
        setIsLiked(true);
      }
    } catch (error) {
      console.error('Error handling like:', error);
      toast({
        title: "Errore",
        description: "Impossibile gestire il mi piace",
        variant: "destructive"
      });
    } finally {
      setIsLikeLoading(false);
    }
  };

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const text = `Leggi "${post.title}" su WayWonder`;
    
    switch (platform) {
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`);
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`);
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`);
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`);
        break;
    }
  };

  const handleSubmitComment = async (content: string) => {
    setSubmittingComment(true);
    try {
      const { error } = await supabase
        .from('blog_comments')
        .insert({
          post_id: postId,
          content: content.trim()
        });

      if (error) throw error;

      fetchComments();
      toast({
        title: "Commento aggiunto",
        description: "Il tuo commento è stato pubblicato con successo",
      });
    } catch (error) {
      console.error('Error submitting comment:', error);
      toast({
        title: "Errore",
        description: "Impossibile pubblicare il commento",
        variant: "destructive",
      });
    } finally {
      setSubmittingComment(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <MainMenu />
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto p-4">
        <MainMenu />
        <div className="text-center py-12">
          <p className="text-gray-500">Post non trovato</p>
        </div>
      </div>
    );
  }

  const metaDescription = post.content && typeof post.content === 'string'
    ? (post.content.length > 140 
        ? post.content.substring(0, 137) + '...'
        : post.content)
    : '';

  const absoluteCoverImageUrl = post.cover_image_url
    ? new URL(post.cover_image_url, window.location.origin).toString()
    : '';
  const postUrl = `${window.location.origin}/blog/${post.id}`;

  return (
    <>
      <BlogPostMeta
        title={post.title || ''}
        description={metaDescription}
        imageUrl={absoluteCoverImageUrl}
        postUrl={postUrl}
      />

      <div className="container mx-auto p-4">
        <MainMenu />
        <div className="max-w-3xl mx-auto mt-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/blog')}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Torna al blog
          </Button>

          <BlogPostContent
            post={post}
            currentUser={currentUser}
            likes={likes}
            isLiked={isLiked}
            isLoading={isLikeLoading}
            onLike={handleLike}
            onShare={handleShare}
          />

          <BlogComments
            comments={comments}
            onSubmitComment={handleSubmitComment}
            isSubmitting={submittingComment}
          />
        </div>
      </div>
    </>
  );
}
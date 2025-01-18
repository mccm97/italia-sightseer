import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { MainMenu } from '@/components/MainMenu';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { BlogPostHeader } from '@/components/blog/BlogPostHeader';
import { BlogPostActions } from '@/components/blog/BlogPostActions';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Helmet } from 'react-helmet';

export default function BlogPost() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchPost();
    fetchComments();
  }, [postId]);

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

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;

    setSubmittingComment(true);
    try {
      const { error } = await supabase
        .from('blog_comments')
        .insert({
          post_id: postId,
          content: newComment.trim()
        });

      if (error) throw error;

      setNewComment('');
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

  // Create a truncated version of the content for meta description
  const metaDescription = post.content.length > 140 
    ? post.content.substring(0, 137) + '...'
    : post.content;

  // Get the absolute URL for the cover image
  const absoluteCoverImageUrl = post.cover_image_url 
    ? new URL(post.cover_image_url, 'https://waywonder.info').toString()
    : '';

  const postUrl = `https://waywonder.info/blog/${post.id}`;

  return (
    <>
      <Helmet>
        <title>{`${post.title} | WayWonder Blog`}</title>
        <meta name="description" content={metaDescription} />
        
        {/* Open Graph meta tags for social sharing */}
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={postUrl} />
        {absoluteCoverImageUrl && (
          <meta property="og:image" content={absoluteCoverImageUrl} />
        )}
        <meta property="og:site_name" content="WayWonder" />
        
        {/* Twitter Card meta tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={metaDescription} />
        {absoluteCoverImageUrl && (
          <meta name="twitter:image" content={absoluteCoverImageUrl} />
        )}
        <meta name="twitter:site" content="@waywonder" />
      </Helmet>

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

          <Card className="mb-8">
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
                postTitle={post.title}
                postContent={metaDescription}
                coverImageUrl={absoluteCoverImageUrl}
                likes={0}
                isLiked={false}
                isLoading={false}
                onLike={async () => {}}
                onShare={() => {}}
              />
            </CardContent>
          </Card>

          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Commenti</h2>
            
            <div className="space-y-4">
              <Textarea
                placeholder="Scrivi un commento..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <Button 
                onClick={handleSubmitComment}
                disabled={submittingComment || !newComment.trim()}
              >
                {submittingComment && (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                )}
                Pubblica commento
              </Button>
            </div>

            <div className="space-y-4">
              {comments.map((comment) => (
                <Card key={comment.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold">
                            {comment.profiles?.username || 'Utente anonimo'}
                          </span>
                          <span className="text-sm text-gray-500">
                            {new Date(comment.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-gray-700">{comment.content}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
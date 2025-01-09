import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { MainMenu } from '@/components/MainMenu';
import { BlogPost } from '@/components/blog/BlogPost';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2, Image as ImageIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  created_at: string;
  user_id: string;
  cover_image_url: string | null;
  profiles: {
    username: string | null;
    avatar_url: string | null;
  } | null;
}

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
    fetchPosts();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setIsAuthenticated(!!session);
  };

  const fetchPosts = async () => {
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
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast({
        title: "Errore",
        description: "Impossibile caricare i post del blog",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Accesso richiesto",
        description: "Devi effettuare l'accesso per pubblicare un post",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }

    if (content.trim().split(/\s+/).length < 50) {
      toast({
        title: "Contenuto troppo breve",
        description: "Il post deve contenere almeno 50 parole",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const { error } = await supabase
        .from('blog_posts')
        .insert([
          {
            content,
            title: content.split('\n')[0] || 'Nuovo post',
            is_published: true
          }
        ]);

      if (error) throw error;

      toast({
        title: "Post pubblicato",
        description: "Il tuo post è stato pubblicato con successo",
      });
      
      setContent('');
      fetchPosts();
    } catch (error) {
      console.error('Error creating post:', error);
      toast({
        title: "Errore",
        description: "Impossibile pubblicare il post",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <MainMenu />
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Blog</h1>
        
        {isAuthenticated && (
          <Card className="p-4 mb-8">
            <Textarea
              placeholder="Cosa vuoi condividere oggi?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[120px] mb-4"
            />
            <div className="flex justify-between items-center">
              <Button variant="outline" className="gap-2">
                <ImageIcon className="h-4 w-4" />
                Aggiungi foto
              </Button>
              <Button 
                onClick={handleCreatePost} 
                disabled={isSubmitting || !content.trim()}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Pubblicazione...
                  </>
                ) : (
                  'Pubblica'
                )}
              </Button>
            </div>
          </Card>
        )}
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : posts.length > 0 ? (
          <div className="space-y-8">
            {posts.map((post) => (
              <BlogPost key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">Nessun post pubblicato</p>
          </div>
        )}
      </div>
    </div>
  );
}
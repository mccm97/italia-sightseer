import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { MainMenu } from '@/components/MainMenu';
import { BlogPost } from '@/components/blog/BlogPost';
import { CreatePostInput } from '@/components/blog/CreatePostInput';
import { Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';

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
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      let query = supabase
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

      // Se l'utente è autenticato, includiamo anche i suoi post non pubblicati
      if (user) {
        query = query.or(`is_published.eq.true,user_id.eq.${user.id}`);
      }

      const { data, error } = await query;

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

  return (
    <>
      <Helmet>
        <title>Blog di Viaggio - WayWonder</title>
        <meta name="description" content="Scopri storie di viaggio, consigli e destinazioni attraverso il nostro blog. Leggi le esperienze dei viaggiatori e trova ispirazione per il tuo prossimo viaggio." />
        <meta name="keywords" content="blog viaggio, storie di viaggio, consigli viaggio, destinazioni Italia, WayWonder blog" />
        <link rel="canonical" href="https://waywonder.com/blog" />
        <meta property="og:title" content="Blog di Viaggio - WayWonder" />
        <meta property="og:description" content="Scopri storie di viaggio, consigli e destinazioni attraverso il nostro blog." />
        <meta property="og:url" content="https://waywonder.com/blog" />
      </Helmet>
      <div className="container mx-auto p-4">
        <div className="flex items-center gap-4 mb-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Indietro
          </Button>
        </div>
        <MainMenu />
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Blog</h1>
          
          <CreatePostInput />
          
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
    </>
  );
}
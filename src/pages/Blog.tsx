import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { MainMenu } from '@/components/MainMenu';
import { BlogPost as BlogPostComponent } from '@/components/blog/BlogPost';
import { CreatePostInput } from '@/components/blog/CreatePostInput';
import { Loader2 } from 'lucide-react';
import { BlogPost } from '@/types/blog';

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { id } = useParams();

  useEffect(() => {
    fetchPosts();
  }, [id]);

  const fetchPosts = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      console.log('Fetching posts...');
      
      let query = supabase
        .from('blog_posts')
        .select(`
          *,
          creator:user_id (
            id,
            username,
            avatar_url
          )
        `)
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      // Se c'è un ID specifico, filtra per quel post
      if (id) {
        query = query.eq('id', id);
      }

      // Se l'utente è autenticato, includiamo anche i suoi post non pubblicati
      if (user) {
        query = query.or(`is_published.eq.true,user_id.eq.${user.id}`);
      }

      const { data, error } = await query;

      if (error) throw error;
      
      console.log('Posts fetched:', data);
      
      const formattedPosts: BlogPost[] = data?.map(post => ({
        ...post,
        creator: post.creator
      })) || [];
      
      console.log('Formatted posts:', formattedPosts);
      
      setPosts(formattedPosts);
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
    <div className="container mx-auto p-4">
      <MainMenu />
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Blog</h1>
        
        {!id && <CreatePostInput />}
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : posts.length > 0 ? (
          <div className="space-y-8">
            {posts.map((post) => (
              <BlogPostComponent key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">
              {id ? "Post non trovato" : "Nessun post pubblicato"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
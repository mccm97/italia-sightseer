import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { MainMenu } from '@/components/MainMenu';
import { CreatePostInput } from '@/components/blog/CreatePostInput';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BlogPostHeader } from '@/components/blog/BlogPostHeader';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { CitySelector } from '@/components/blog/CitySelector';

export default function Blog() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAboutCity, setIsAboutCity] = useState(false);
  const [selectedCity, setSelectedCity] = useState<any>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
  }, [selectedCity]);

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

      if (selectedCity) {
        query = query.eq('city_id', selectedCity.id);
      }

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

  const getPostPreview = (content: string) => {
    const maxLength = 200;
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  return (
    <>
      <Helmet>
        <title>Blog di Viaggio - Esperienze e Itinerari in Italia | WayWonder</title>
        <meta 
          name="description" 
          content="Scopri storie di viaggio autentiche, consigli pratici e destinazioni imperdibili attraverso il nostro blog. Leggi le esperienze dei viaggiatori e trova ispirazione per il tuo prossimo viaggio in Italia." 
        />
      </Helmet>
      <div className="container mx-auto p-4">
        <MainMenu />
        <div className="max-w-2xl mx-auto mt-16">
          <h1 className="text-3xl font-bold mb-8">Blog</h1>
          
          <CreatePostInput onPostCreated={fetchPosts} />
          
          <div className="mb-8">
            <CitySelector
              isAboutCity={isAboutCity}
              setIsAboutCity={setIsAboutCity}
              selectedCity={selectedCity}
              setSelectedCity={setSelectedCity}
            />
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : posts.length > 0 ? (
            <div className="space-y-8">
              {posts.map((post) => (
                <Card key={post.id} className="cursor-pointer hover:shadow-lg transition-shadow">
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
                    {post.cover_image_url && (
                      <div className="w-full h-48 mb-4 relative">
                        <img
                          src={post.cover_image_url}
                          alt={post.title}
                          className="w-full h-full object-cover rounded"
                        />
                      </div>
                    )}
                    <p className="text-gray-600 mb-4">{getPostPreview(post.content)}</p>
                    <Button 
                      variant="outline"
                      onClick={() => navigate(`/blog/${post.id}`)}
                    >
                      Leggi di più
                    </Button>
                  </CardContent>
                </Card>
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
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { BookOpen } from 'lucide-react';

interface UserBlogPostsProps {
  userId: string;
}

export function UserBlogPosts({ userId }: UserBlogPostsProps) {
  const { data: posts, isLoading } = useQuery({
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
          <h3 className="font-semibold text-lg mb-2">{post.title}</h3>
          <p className="line-clamp-3">{post.content}</p>
          <p className="text-sm text-muted-foreground mt-2">
            {new Date(post.created_at).toLocaleDateString('it-IT')}
          </p>
        </div>
      ))}
    </div>
  );
}
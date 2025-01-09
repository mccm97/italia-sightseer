import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ThumbsUp } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

interface BlogPostProps {
  post: {
    id: string;
    title: string;
    content: string;
    created_at: string;
    cover_image_url: string | null;
    user_id?: string;
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
      <CardHeader className="flex flex-row items-center gap-4">
        <Link to={`/profile/${post.user_id}`} className="hover:opacity-80 transition-opacity">
          <Avatar>
            <AvatarImage src={post.profiles?.avatar_url || undefined} />
            <AvatarFallback>
              {post.profiles?.username?.[0]?.toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
        </Link>
        <div>
          <h2 className="text-2xl font-bold">{post.title}</h2>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link 
              to={`/profile/${post.user_id}`}
              className="hover:underline hover:text-gray-700 transition-colors"
            >
              {post.profiles?.username || 'Utente anonimo'}
            </Link>
            <span>•</span>
            <span>{formatDate(post.created_at)}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="whitespace-pre-wrap mb-6">{post.content}</p>
        <div className="flex items-center gap-2 border-t pt-4">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleLike}
            disabled={isLoading}
            className={`flex-1 ${isLiked ? 'bg-blue-50 hover:bg-blue-100' : ''}`}
          >
            <ThumbsUp className={`h-5 w-5 mr-2 ${isLiked ? 'fill-blue-500 text-blue-500' : ''}`} />
            <span className={`${isLiked ? 'text-blue-500' : ''}`}>
              {likes} Mi piace
            </span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
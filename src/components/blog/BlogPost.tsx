import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Share2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { it } from 'date-fns/locale';
import { BlogPost as BlogPostType } from '@/types/blog';
import { supabase } from '@/integrations/supabase/client';

interface BlogPostProps {
  post: BlogPostType;
  onLike?: () => void;
  isLiked?: boolean;
}

export function BlogPost({ post, onLike, isLiked }: BlogPostProps) {
  const navigate = useNavigate();
  const [isSharing, setIsSharing] = useState(false);
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  // Ottieni l'utente corrente quando il componente viene montato
  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user?.id || null);
    };
    getCurrentUser();
  }, []);

  const handleShare = async (platform: string) => {
    const postUrl = `${window.location.origin}/blog/${post.id}`;
    const text = `Leggi "${post.title}" su WayWonder`;

    let shareUrl = '';
    switch (platform) {
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(`${text}\n${postUrl}`)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(postUrl)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`;
        break;
      default:
        return;
    }

    window.open(shareUrl, '_blank', 'noopener,noreferrer');
  };

  const navigateToProfile = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Se il post è dell'utente corrente, vai al proprio profilo
    // Altrimenti vai al profilo del creatore
    const profileId = post.creator?.id;
    if (profileId) {
      console.log('Navigating to profile:', profileId, 'Current user:', currentUser);
      navigate(`/profile/${profileId}`);
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center gap-4">
        <div 
          onClick={navigateToProfile}
          className="cursor-pointer"
        >
          <Avatar>
            <AvatarImage src={post.creator?.avatar_url} />
            <AvatarFallback>{post.creator?.username?.[0]?.toUpperCase()}</AvatarFallback>
          </Avatar>
        </div>
        <div className="flex flex-col">
          <span 
            className="font-semibold cursor-pointer hover:underline"
            onClick={navigateToProfile}
          >
            {post.creator?.username}
          </span>
          <span className="text-sm text-gray-500">
            {formatDistanceToNow(new Date(post.created_at), { addSuffix: true, locale: it })}
          </span>
        </div>
      </CardHeader>

      <CardContent>
        <h2 className="text-xl font-bold mb-4">{post.title}</h2>
        {post.cover_image_url && (
          <img
            src={post.cover_image_url}
            alt={post.title}
            className="w-full h-64 object-cover rounded-md mb-4"
          />
        )}
        <p className="whitespace-pre-wrap">{post.content}</p>
      </CardContent>

      <CardFooter className="flex justify-between">
        <Button
          variant={isLiked ? "default" : "outline"}
          onClick={onLike}
          className="gap-2"
        >
          {isLiked ? "Mi piace" : "Mi piace"}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Share2 className="h-4 w-4" />
              Condividi
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => handleShare('whatsapp')}>
              WhatsApp
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleShare('facebook')}>
              Facebook
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleShare('twitter')}>
              Twitter
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleShare('linkedin')}>
              LinkedIn
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardFooter>
    </Card>
  );
}
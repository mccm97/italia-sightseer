import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ThumbsUp, Share2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface BlogPostActionsProps {
  postId: string;
  postTitle: string;
  postContent: string;
  coverImageUrl: string;
  likes: number;
  isLiked: boolean;
  isLoading: boolean;
  onLike: () => Promise<void>;
  onShare: (platform: string) => void;
}

export function BlogPostActions({ 
  postId, 
  postTitle,
  postContent,
  coverImageUrl,
  likes, 
  isLiked, 
  isLoading, 
  onLike, 
  onShare 
}: BlogPostActionsProps) {
  const handleShare = (platform: string) => {
    const postUrl = `https://waywonder.info/blog/${postId}`;
    const text = encodeURIComponent(postTitle);
    const description = encodeURIComponent(postContent);
    
    const shareUrls = {
      whatsapp: `https://wa.me/?text=${text}%20${postUrl}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`,
      twitter: `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(postUrl)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`
    };

    window.open(shareUrls[platform as keyof typeof shareUrls], '_blank');
  };

  return (
    <div className="flex items-center gap-2 border-t pt-4">
      <Button 
        variant="ghost" 
        size="sm"
        onClick={onLike}
        disabled={isLoading}
        className={`flex-1 ${isLiked ? 'bg-blue-50 hover:bg-blue-100' : ''}`}
      >
        <ThumbsUp className={`h-5 w-5 mr-2 ${isLiked ? 'fill-blue-500 text-blue-500' : ''}`} />
        <span className={`${isLiked ? 'text-blue-500' : ''}`}>
          {likes} Mi piace
        </span>
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="flex-1">
            <Share2 className="h-5 w-5 mr-2" />
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
    </div>
  );
}
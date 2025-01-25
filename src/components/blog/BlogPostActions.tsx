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
          <DropdownMenuItem onClick={() => onShare('whatsapp')}>
            WhatsApp
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onShare('facebook')}>
            Facebook
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onShare('twitter')}>
            Twitter
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onShare('linkedin')}>
            LinkedIn
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
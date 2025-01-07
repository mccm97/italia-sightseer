import { CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ThumbsUp, Star } from 'lucide-react';

interface RouteCardHeaderProps {
  name: string;
  creatorUsername?: string;
  isLiked: boolean;
  likesCount: number;
  averageRating?: number;
  onLikeClick: (e: React.MouseEvent) => void;
}

export function RouteCardHeader({
  name,
  creatorUsername,
  isLiked,
  likesCount,
  averageRating,
  onLikeClick
}: RouteCardHeaderProps) {
  return (
    <CardHeader>
      <CardTitle className="flex justify-between items-center">
        <div className="flex flex-col">
          <span>{name}</span>
          <span className="text-sm text-muted-foreground">
            Creato da: {creatorUsername || 'Utente anonimo'}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onLikeClick}
            className={`flex items-center gap-1 ${isLiked ? 'text-red-500' : ''}`}
          >
            <ThumbsUp className="w-4 h-4" />
            <span>{likesCount}</span>
          </Button>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-400" />
            <span>{averageRating?.toFixed(1) || '0.0'}</span>
          </div>
        </div>
      </CardTitle>
    </CardHeader>
  );
}
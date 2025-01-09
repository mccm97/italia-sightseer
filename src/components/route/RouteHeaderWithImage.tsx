import { CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Link } from 'react-router-dom';

interface RouteHeaderWithImageProps {
  name: string;
  creatorUsername?: string;
  creatorId?: string;
  creatorAvatarUrl?: string;
  imageUrl?: string;
}

export function RouteHeaderWithImage({
  name,
  creatorUsername,
  creatorId,
  creatorAvatarUrl,
  imageUrl
}: RouteHeaderWithImageProps) {
  // Log per debugging
  console.log('Route creator ID:', creatorId);

  return (
    <div className="flex items-start gap-4 p-4">
      <div className="flex-1">
        <CardHeader className="p-0">
          <CardTitle className="flex flex-col">
            <span>{name}</span>
            <div className="flex items-center gap-2 mt-2">
              {creatorId ? (
                <Link 
                  to={`/profile/${creatorId}`}
                  className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log('Navigating to route creator profile:', creatorId);
                  }}
                >
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={creatorAvatarUrl} />
                    <AvatarFallback>
                      {creatorUsername?.[0]?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-muted-foreground hover:underline">
                    {creatorUsername || 'Utente anonimo'}
                  </span>
                </Link>
              ) : (
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-muted-foreground">
                    Utente anonimo
                  </span>
                </div>
              )}
            </div>
          </CardTitle>
        </CardHeader>
      </div>
      {imageUrl && (
        <div className="relative w-32 h-32 flex-shrink-0">
          <img 
            src={imageUrl} 
            alt={`Immagine del percorso ${name}`}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
      )}
    </div>
  );
}
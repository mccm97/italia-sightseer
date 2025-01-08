import { CardHeader, CardTitle } from '@/components/ui/card';

interface RouteHeaderWithImageProps {
  name: string;
  creatorUsername?: string;
  imageUrl?: string;
}

export function RouteHeaderWithImage({
  name,
  creatorUsername,
  imageUrl
}: RouteHeaderWithImageProps) {
  return (
    <div className="flex items-start gap-4 p-4">
      <div className="flex-1">
        <CardHeader className="p-0">
          <CardTitle className="flex flex-col">
            <span>{name}</span>
            <span className="text-sm text-muted-foreground">
              Creato da: {creatorUsername || 'Utente anonimo'}
            </span>
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
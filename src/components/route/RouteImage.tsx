import React from 'react';

interface RouteImageProps {
  imageUrl?: string;
  routeName: string;
}

export function RouteImage({ imageUrl, routeName }: RouteImageProps) {
  return imageUrl ? (
    <div className="w-full h-48 relative">
      <img 
        src={imageUrl} 
        alt={`Immagine del percorso ${routeName}`}
        className="w-full h-full object-cover"
      />
    </div>
  ) : (
    <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-gray-500">
      Immagine percorso non disponibile
    </div>
  );
}
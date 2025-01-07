import React from 'react';
import { Skeleton } from '../ui/skeleton';

interface RouteScreenshotProps {
  isLoading: boolean;
  url: string | null;
  routeName: string;
}

export function RouteScreenshot({ isLoading, url, routeName }: RouteScreenshotProps) {
  if (isLoading) {
    return (
      <div className="w-full h-48">
        <Skeleton className="w-full h-full" />
      </div>
    );
  }

  if (!url) {
    return null;
  }

  return (
    <div className="w-full h-48 relative">
      <img 
        src={url} 
        alt={`Screenshot del percorso ${routeName}`}
        className="w-full h-full object-cover"
      />
    </div>
  );
}
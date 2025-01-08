import React from 'react';
import { RouteImage } from './RouteImage';
import { RouteScreenshot } from './RouteScreenshot';

interface RouteCardMediaProps {
  routeId: string;
  routeName: string;
  imageUrl?: string;
}

export function RouteCardMedia({ routeId, routeName, imageUrl }: RouteCardMediaProps) {
  return (
    <div className="space-y-4">
      <RouteImage imageUrl={imageUrl} routeName={routeName} />
      <RouteScreenshot routeId={routeId} routeName={routeName} />
    </div>
  );
}
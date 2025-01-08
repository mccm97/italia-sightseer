import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface RouteScreenshotProps {
  routeId: string;
  routeName: string;
}

export function RouteScreenshot({ routeId, routeName }: RouteScreenshotProps) {
  const { data: screenshot, isLoading } = useQuery({
    queryKey: ['routeScreenshot', routeId],
    queryFn: async () => {
      console.log('Fetching screenshot for route:', routeId);
      const { data, error } = await supabase
        .from('screenshots')
        .select('screenshot_url')
        .eq('route_id', routeId)
        .single();

      if (error) {
        console.error('Error fetching screenshot:', error);
        return null;
      }

      console.log('Screenshot data:', data);
      return data?.screenshot_url;
    }
  });

  if (isLoading) {
    return (
      <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-gray-500">
        Caricamento anteprima...
      </div>
    );
  }

  return screenshot ? (
    <div className="w-full h-48 relative">
      <img 
        src={screenshot} 
        alt={`Screenshot del percorso ${routeName}`}
        className="w-full h-full object-cover"
      />
    </div>
  ) : (
    <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-gray-500">
      Anteprima mappa non ancora disponibile
    </div>
  );
}
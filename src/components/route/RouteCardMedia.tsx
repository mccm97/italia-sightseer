import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { RouteImage } from './RouteImage';
import { RouteScreenshot } from './RouteScreenshot';

interface RouteCardMediaProps {
  routeId: string;
  routeName: string;
  imageUrl?: string;
}

export function RouteCardMedia({ routeId, routeName, imageUrl }: RouteCardMediaProps) {
  const { data: screenshot } = useQuery({
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
        throw error;
      }

      console.log('Screenshot data:', data);
      return data?.screenshot_url;
    }
  });

  return (
    <div className="space-y-4">
      <RouteImage imageUrl={imageUrl} routeName={routeName} />
      <RouteScreenshot routeId={routeId} routeName={routeName} />
    </div>
  );
}
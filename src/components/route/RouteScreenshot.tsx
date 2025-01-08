import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { MapOff } from 'lucide-react';

interface RouteScreenshotProps {
  routeId: string;
}

export function RouteScreenshot({ routeId }: RouteScreenshotProps) {
  const [screenshotUrl, setScreenshotUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchScreenshot = async () => {
      try {
        console.log('Fetching screenshot for route:', routeId);
        const { data, error } = await supabase
          .from('screenshots')
          .select('screenshot_url')
          .eq('route_id', routeId)
          .maybeSingle();

        if (error) {
          console.error('Error fetching screenshot:', error);
          setError(error.message);
          return;
        }

        console.log('Screenshot data:', data);
        setScreenshotUrl(data?.screenshot_url || null);
      } catch (err) {
        console.error('Error in screenshot fetch:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    };

    if (routeId) {
      fetchScreenshot();
    }
  }, [routeId]);

  if (isLoading) {
    return <Skeleton className="w-full h-full" />;
  }

  if (error || !screenshotUrl) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <div className="text-center text-gray-500">
          <MapOff className="w-12 h-12 mx-auto mb-2" />
          <p className="text-sm">Anteprima non disponibile</p>
        </div>
      </div>
    );
  }

  return (
    <img
      src={screenshotUrl}
      alt="Route preview"
      className="w-full h-full object-cover"
      onError={(e) => {
        console.error('Error loading screenshot image');
        setError('Failed to load image');
      }}
    />
  );
}
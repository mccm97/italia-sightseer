import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface RouteScreenshotProps {
  routeId: string;
}

export function RouteScreenshot({ routeId }: RouteScreenshotProps) {
  const [screenshotUrl, setScreenshotUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchScreenshot = async () => {
      try {
        console.log('Fetching screenshot for route:', routeId);
        const { data, error } = await supabase
          .from('screenshots')
          .select('screenshot_url')
          .eq('route_id', routeId)
          .maybeSingle();

        console.log('Screenshot query result:', data);

        if (error) {
          console.error('Error fetching screenshot:', error);
          throw error;
        }

        setScreenshotUrl(data?.screenshot_url || null);
      } catch (error) {
        console.error('Error in screenshot fetch:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (routeId) {
      fetchScreenshot();
    }
  }, [routeId]);

  if (isLoading) {
    return <div>Caricamento anteprima...</div>;
  }

  if (!screenshotUrl) {
    return <div>Anteprima mappa non disponibile</div>;
  }

  return (
    <img
      src={screenshotUrl}
      alt="Anteprima del percorso"
      className="w-full h-auto rounded-lg"
    />
  );
}
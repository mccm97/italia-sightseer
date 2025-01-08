import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Map } from 'lucide-react';

interface RouteCardMediaProps {
  routeId: string;
  imageUrl?: string | null;
}

export function RouteCardMedia({ routeId, imageUrl }: RouteCardMediaProps) {
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScreenshot = async () => {
      console.log('Fetching screenshot for route:', routeId);
      try {
        if (imageUrl) {
          setScreenshot(imageUrl);
          setLoading(false);
          return;
        }

        const { data: screenshotData } = await supabase
          .from('screenshots')
          .select('screenshot_url')
          .eq('route_id', routeId)
          .single();

        if (screenshotData?.screenshot_url) {
          console.log('Screenshot found:', screenshotData.screenshot_url);
          setScreenshot(screenshotData.screenshot_url);
        }
      } catch (error) {
        console.error('Error fetching screenshot:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchScreenshot();
  }, [routeId, imageUrl]);

  if (loading) {
    return <Skeleton className="w-full h-48" />;
  }

  return (
    <AspectRatio ratio={16 / 9} className="bg-muted">
      {screenshot ? (
        <img
          src={screenshot}
          alt="Route preview"
          className="object-cover w-full h-full rounded-md"
        />
      ) : (
        <div className="flex items-center justify-center w-full h-full bg-muted">
          <Map className="h-12 w-12 text-muted-foreground" />
        </div>
      )}
    </AspectRatio>
  );
}
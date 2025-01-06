import React from 'react';
import { Button } from '@/components/ui/button';
import { Camera } from 'lucide-react';
import html2canvas from 'html2to-image';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface RouteScreenshotButtonProps {
  routeId: string;
  onScreenshotTaken?: () => void;
}

export function RouteScreenshotButton({ routeId, onScreenshotTaken }: RouteScreenshotButtonProps) {
  const { toast } = useToast();

  const takeScreenshot = async () => {
    try {
      const mapElement = document.getElementById('route-map');
      if (!mapElement) {
        toast({
          title: "Errore",
          description: "Impossibile trovare la mappa",
          variant: "destructive"
        });
        return;
      }

      const canvas = await html2canvas(mapElement);
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => resolve(blob!), 'image/png');
      });

      const fileName = `${routeId}.png`;
      const { error: uploadError } = await supabase.storage
        .from('screenshots')
        .upload(fileName, blob, {
          upsert: true,
          contentType: 'image/png'
        });

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('screenshots')
        .getPublicUrl(fileName);

      const { error: dbError } = await supabase
        .from('screenshots')
        .upsert({
          route_id: routeId,
          screenshot_url: publicUrl
        });

      if (dbError) {
        throw dbError;
      }

      toast({
        title: "Screenshot salvato",
        description: "Lo screenshot del percorso è stato salvato con successo",
      });

      onScreenshotTaken?.();
    } catch (error) {
      console.error('Error taking screenshot:', error);
      toast({
        title: "Errore",
        description: "Impossibile salvare lo screenshot",
        variant: "destructive"
      });
    }
  };

  return (
    <Button
      onClick={takeScreenshot}
      className="flex items-center gap-2"
      variant="outline"
    >
      <Camera className="w-4 h-4" />
      Salva Screenshot
    </Button>
  );
}
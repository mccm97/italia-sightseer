import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";
import * as htmlToImage from 'html-to-image';
import { useToast } from "@/hooks/use-toast";

interface RouteScreenshotButtonProps {
  onScreenshotCapture: (imageBlob: Blob) => void;
}

export function RouteScreenshotButton({ onScreenshotCapture }: RouteScreenshotButtonProps) {
  const { toast } = useToast();

  const captureScreenshot = async () => {
    const mapElement = document.getElementById('map-preview');
    if (!mapElement) {
      toast({
        title: "Errore",
        description: "Impossibile trovare l'elemento mappa",
        variant: "destructive"
      });
      return;
    }

    try {
      const dataUrl = await htmlToImage.toPng(mapElement);
      const blob = await (await fetch(dataUrl)).blob();
      onScreenshotCapture(blob);
      
      toast({
        title: "Screenshot catturato",
        description: "L'immagine del percorso è stata salvata con successo",
      });
    } catch (error) {
      console.error('Error capturing screenshot:', error);
      toast({
        title: "Errore",
        description: "Impossibile catturare lo screenshot",
        variant: "destructive"
      });
    }
  };

  return (
    <Button 
      onClick={captureScreenshot}
      className="flex items-center gap-2"
    >
      <Camera className="w-4 h-4" />
      Cattura Screenshot
    </Button>
  );
}
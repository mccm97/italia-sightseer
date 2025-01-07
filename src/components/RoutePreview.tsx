import React, { useEffect, useState, useRef } from 'react';
import { Button } from './ui/button';
import CityMap from './CityMap';
import { CreateRouteFormData } from '@/types/route';
import { ArrowLeft, Camera } from 'lucide-react';
import { geocodeAddress } from '@/services/geocoding';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import html2canvas from 'html2canvas';
import { supabase } from '@/integrations/supabase/client';

interface RoutePreviewProps {
  formData: CreateRouteFormData;
  onBack: () => void;
  onCreateRoute?: () => void;
}

export function RoutePreview({ formData, onBack, onCreateRoute }: RoutePreviewProps) {
  const [attractions, setAttractions] = useState<Array<{ name: string; position: [number, number] }>>([]);
  const [totalTravelTime, setTotalTravelTime] = useState(0);
  const [showScreenshotDialog, setShowScreenshotDialog] = useState(false);
  const [screenshotTaken, setScreenshotTaken] = useState(false);
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const loadAttractionPositions = async () => {
      try {
        const positions = await Promise.all(
          formData.attractions.map(async (attraction) => {
            const searchTerm = attraction.inputType === 'address' 
              ? `${attraction.address}, ${formData.city?.name}, Italia`
              : `${attraction.name}, ${formData.city?.name}, Italia`;
              
            const position = await geocodeAddress(searchTerm);
            console.log(`Geocoded position for ${searchTerm}:`, position);
            
            return {
              name: attraction.name || attraction.address,
              position: position
            };
          })
        );
        
        setAttractions(positions);

        if (positions.length > 1) {
          const travelTimes = await Promise.all(
            positions.slice(0, -1).map(async (start, i) => {
              const end = positions[i + 1];
              const response = await fetch(
                `https://router.project-osrm.org/route/v1/foot/${start.position[1]},${start.position[0]};${end.position[1]},${end.position[0]}?overview=full`
              );
              const data = await response.json();
              return Math.round(data.routes[0].duration / 60);
            })
          );

          const totalTime = travelTimes.reduce((sum, time) => sum + time, 0);
          setTotalTravelTime(formData.transportMode === 'public' ? Math.round(totalTime / 3) : totalTime);
        }
      } catch (error) {
        console.error('Error loading positions:', error);
        toast({
          title: "Errore",
          description: "Impossibile caricare le posizioni di alcune attrazioni",
          variant: "destructive"
        });
      }
    };

    loadAttractionPositions();
  }, [formData, toast]);

  const handleTakeScreenshot = async () => {
    if (!mapRef.current) return;

    try {
      const canvas = await html2canvas(mapRef.current);
      canvas.toBlob(async (blob) => {
        if (blob) {
          const file = new File([blob], 'route-screenshot.png', { type: 'image/png' });
          setScreenshotFile(file);
          setScreenshotTaken(true);
          setShowScreenshotDialog(false); // Close dialog after successful capture
          toast({
            title: "Screenshot catturato",
            description: "Lo screenshot è stato salvato correttamente",
          });
        }
      });
    } catch (error) {
      console.error('Error taking screenshot:', error);
      toast({
        title: "Errore",
        description: "Impossibile catturare lo screenshot",
        variant: "destructive"
      });
    }
  };

  const handleCreateRoute = async () => {
    if (!screenshotFile) {
      toast({
        title: "Screenshot richiesto",
        description: "Per favore, cattura uno screenshot del percorso prima di procedere",
        variant: "destructive"
      });
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const screenshotPath = `${user.id}/${crypto.randomUUID()}.png`;
      const { error: uploadError } = await supabase.storage
        .from('screenshots')
        .upload(screenshotPath, screenshotFile);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('screenshots')
        .getPublicUrl(screenshotPath);

      const { error: dbError } = await supabase
        .from('screenshots')
        .insert({
          route_id: null, // This will be updated after route creation
          screenshot_url: publicUrl
        });

      if (dbError) throw dbError;

      onCreateRoute?.();
      
      toast({
        title: "Percorso creato",
        description: "Il percorso è stato creato con successo!",
      });
    } catch (error) {
      console.error('Error saving screenshot:', error);
      toast({
        title: "Errore",
        description: "Impossibile salvare lo screenshot",
        variant: "destructive"
      });
    }
  };

  const totalVisitDuration = formData.attractions.reduce((sum, attr) => sum + (attr.visitDuration || 0), 0);
  const totalDuration = totalVisitDuration + totalTravelTime;
  const totalPrice = formData.attractions.reduce((sum, attr) => sum + (attr.price || 0), 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <Button 
          variant="outline" 
          onClick={onBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Torna alla creazione
        </Button>
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={() => setShowScreenshotDialog(true)}
            className="flex items-center gap-2"
          >
            <Camera className="w-4 h-4" />
            {screenshotTaken ? 'Nuovo Screenshot' : 'Cattura Screenshot'}
          </Button>
          <Button 
            onClick={handleCreateRoute}
            className="bg-primary text-white"
            disabled={!screenshotTaken}
          >
            Crea Percorso
          </Button>
        </div>
      </div>

      <h2 className="text-2xl font-bold">Anteprima Percorso</h2>
      
      <div className="bg-muted p-4 rounded-lg space-y-2">
        <p><strong>Durata totale:</strong> {totalDuration} minuti</p>
        <p><strong>Tempo di visita:</strong> {totalVisitDuration} minuti</p>
        <p><strong>Tempo di spostamento:</strong> {totalTravelTime} minuti</p>
        <p><strong>Costo totale:</strong> €{totalPrice.toFixed(2)}</p>
        <p><strong>Modalità di trasporto:</strong> {formData.transportMode === 'walking' ? 'A piedi' : 'Mezzi pubblici'}</p>
      </div>
      
      <div ref={mapRef} className="h-[400px] w-full">
        <CityMap
          center={[formData.city?.lat || 0, formData.city?.lng || 0]}
          attractions={attractions}
          showWalkingPath={true}
        />
      </div>

      <Dialog open={showScreenshotDialog} onOpenChange={setShowScreenshotDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cattura Screenshot del Percorso</DialogTitle>
            <DialogDescription>
              Per favore, assicurati che il percorso sia completamente visibile sulla mappa prima di procedere.
              Lo screenshot verrà mostrato agli altri utenti quando visualizzeranno i dettagli del percorso.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <p>1. Usa i controlli della mappa per centrare e zoomare il percorso</p>
            <p>2. Assicurati che tutti i punti di interesse siano visibili</p>
            <p>3. Clicca il pulsante qui sotto per catturare lo screenshot</p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowScreenshotDialog(false)}>
                Annulla
              </Button>
              <Button onClick={handleTakeScreenshot}>
                Cattura Screenshot
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
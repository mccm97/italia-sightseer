import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DirectionsStep } from "@/types/route";
import { Loader2 } from "lucide-react";

interface DirectionsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  directions: DirectionsStep[];
  isLoading?: boolean;
}

export function DirectionsDialog({ isOpen, onClose, directions, isLoading }: DirectionsDialogProps) {
  console.log('Directions in dialog:', directions);
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Indicazioni del Percorso</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[400px] pr-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
              <p className="text-muted-foreground">Caricamento indicazioni...</p>
            </div>
          ) : directions && directions.length > 0 ? (
            <div className="space-y-4">
              {directions.map((step, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    {index + 1}
                  </div>
                  <div>
                    <p>{step.instruction}</p>
                    <p className="text-sm text-muted-foreground">
                      {step.distance}m • {Math.round(step.duration / 60)} min
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-8">
              <p className="text-lg font-medium">
                Nessuna indicazione disponibile per questo percorso
              </p>
              <p className="text-sm mt-2">
                Prova a ricaricare la pagina o contatta l'assistenza se il problema persiste.
              </p>
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
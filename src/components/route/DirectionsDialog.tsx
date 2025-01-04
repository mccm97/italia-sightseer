import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DirectionsStep } from "@/data/routes";

interface DirectionsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  directions: DirectionsStep[];
}

export function DirectionsDialog({ isOpen, onClose, directions }: DirectionsDialogProps) {
  console.log('Directions in dialog:', directions);
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Indicazioni del Percorso</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {directions && directions.length > 0 ? (
              directions.map((step, index) => (
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
              ))
            ) : (
              <p className="text-center text-muted-foreground">
                Nessuna indicazione disponibile per questo percorso
              </p>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
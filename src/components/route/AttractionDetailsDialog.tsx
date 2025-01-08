import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AttractionTimeline } from './AttractionTimeline';
import { MapPin, Clock, Euro } from 'lucide-react';

interface AttractionDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  attractions: Array<{
    name: string;
    visitDuration?: number;
    price?: number;
    address?: string;
  }>;
}

export function AttractionDetailsDialog({
  isOpen,
  onClose,
  attractions
}: AttractionDetailsDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Dettagli Attrazioni</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {attractions.map((attraction, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-2">
                <h3 className="font-semibold flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {attraction.name}
                </h3>
                <div className="text-sm text-muted-foreground space-y-1">
                  {attraction.visitDuration && (
                    <p className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Durata visita: {attraction.visitDuration} minuti
                    </p>
                  )}
                  {attraction.price !== undefined && attraction.price > 0 && (
                    <p className="flex items-center gap-2">
                      <Euro className="h-4 w-4" />
                      Prezzo: €{attraction.price.toFixed(2)}
                    </p>
                  )}
                  {attraction.address && (
                    <p className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Indirizzo: {attraction.address}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
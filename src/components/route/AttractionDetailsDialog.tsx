import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Clock, Euro } from "lucide-react";

interface AttractionDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  attractions: Array<{
    name: string;
    visitDuration?: number;
    price?: number;
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
            {attractions?.map((attraction, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-2">
                <h3 className="font-semibold">{attraction.name}</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>{attraction.visitDuration} minuti</span>
                </div>
                {attraction.price !== undefined && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Euro className="w-4 h-4" />
                    <span>€{attraction.price.toFixed(2)}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
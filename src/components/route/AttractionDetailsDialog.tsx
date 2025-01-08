import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AttractionTimeline } from './AttractionTimeline';

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
          <AttractionTimeline attractions={attractions} />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
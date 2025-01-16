import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AttractionTimeline } from './AttractionTimeline';
import { useTranslation } from 'react-i18next';

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
  attractions = []
}: AttractionDetailsDialogProps) {
  const { t } = useTranslation();
  
  console.log('AttractionDetailsDialog - received attractions:', attractions);
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t('routes.attractionsDetails')}</DialogTitle>
          <DialogDescription>
            {t('routes.attractionsDetailsDescription')}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[400px] pr-4">
          {attractions && attractions.length > 0 ? (
            <AttractionTimeline attractions={attractions} />
          ) : (
            <div className="text-center text-muted-foreground py-4">
              {t('routes.noAttractions')}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
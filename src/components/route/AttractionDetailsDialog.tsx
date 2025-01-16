import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AttractionTimeline } from './AttractionTimeline';
import { MapPin } from 'lucide-react';

interface AttractionDetailsDialogProps {
  attractions: Array<{
    name: string;
    visitDuration?: number;
    price?: number;
    position?: [number, number];
  }>;
}

export function AttractionDetailsDialog({ attractions }: AttractionDetailsDialogProps) {
  const { t } = useTranslation();
  console.log('AttractionDetailsDialog - received attractions:', attractions);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <MapPin className="h-4 w-4 mr-2" />
          {t('routes.viewAttractions')}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t('routes.attractionsTitle')}</DialogTitle>
          <DialogDescription>
            {t('routes.attractionsDescription')}
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
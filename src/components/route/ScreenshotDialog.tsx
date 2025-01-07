import React from 'react';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Loader2 } from 'lucide-react';

interface ScreenshotDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTakeScreenshot: () => void;
  isLoading?: boolean;
}

export function ScreenshotDialog({ open, onOpenChange, onTakeScreenshot, isLoading }: ScreenshotDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Annulla
            </Button>
            <Button 
              onClick={onTakeScreenshot}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Cattura in corso...
                </>
              ) : (
                'Cattura Screenshot'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
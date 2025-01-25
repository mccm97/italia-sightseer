import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export function PWAInstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Check if the app is already installed
    const isInstalled = window.matchMedia('(display-mode: standalone)').matches;
    console.log('PWA is installed:', isInstalled);

    if (!isInstalled) {
      // Show prompt immediately if not installed
      setShowPrompt(true);
    }

    const handler = (e: Event) => {
      e.preventDefault();
      console.log('beforeinstallprompt triggered');
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Also listen for installation status changes
    window.matchMedia('(display-mode: standalone)').addEventListener('change', (e) => {
      if (e.matches) {
        console.log('App was installed, hiding prompt');
        setShowPrompt(false);
      }
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) {
      // If no install prompt is available, open in browser install menu
      toast({
        title: "Installazione",
        description: "Per installare l'app, usa il menu del tuo browser",
      });
      return;
    }

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        toast({
          title: "Installazione completata",
          description: "WayWonder è stata installata con successo!",
        });
        setShowPrompt(false);
      }
    } catch (error) {
      console.error('Errore durante l\'installazione:', error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante l'installazione",
        variant: "destructive",
      });
    }

    setDeferredPrompt(null);
  };

  return (
    <Dialog open={showPrompt} onOpenChange={setShowPrompt}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Installa WayWonder</DialogTitle>
          <DialogDescription>
            Installa WayWonder sul tuo dispositivo per un accesso più rapido e una migliore esperienza utente.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end space-x-2 mt-4">
          <Button variant="outline" onClick={() => setShowPrompt(false)}>
            Non ora
          </Button>
          <Button onClick={handleInstall}>
            Installa
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<{ outcome: 'accepted' | 'dismissed' }>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PWAInstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isInstalled = localStorage.getItem('pwa-installed') === 'true';
    
    if (!isStandalone && !isInstalled) {
      setShowPrompt(true);
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowPrompt(true);
    };

    const handleAppInstalled = () => {
      localStorage.setItem('pwa-installed', 'true');
      setShowPrompt(false);
      toast({
        title: "Installazione completata",
        description: "WayWonder è stata installata con successo!",
      });
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [toast]);

  const handleInstall = async () => {
    if (!deferredPrompt) {
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      if (isIOS) {
        toast({
          title: "Installazione su iOS",
          description: "Per installare WayWonder su iOS, tocca l'icona di condivisione e seleziona 'Aggiungi alla schermata Home'",
        });
      } else {
        toast({
          title: "Installazione manuale",
          description: "Per installare l'app, usa il menu del tuo browser e seleziona 'Installa' o 'Aggiungi alla schermata Home'",
        });
      }
      return;
    }

    try {
      const result = await deferredPrompt.prompt();
      if (result.outcome === 'accepted') {
        localStorage.setItem('pwa-installed', 'true');
        toast({
          title: "Installazione in corso",
          description: "WayWonder sta per essere installata...",
        });
      } else {
        toast({
          title: "Installazione annullata",
          description: "Puoi sempre installare WayWonder più tardi dal menu del browser",
        });
      }
    } catch (error) {
      console.error('Errore durante l\'installazione:', error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante l'installazione. Riprova più tardi.",
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
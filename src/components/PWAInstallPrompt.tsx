import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<{ outcome: 'accepted' | 'dismissed' }>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

declare global {
  interface Window {
    deferredPrompt: BeforeInstallPromptEvent | null;
  }
}

export function PWAInstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    console.log('PWAInstallPrompt mounted');
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isInstalled = localStorage.getItem('pwa-installed') === 'true';
    
    if (!isStandalone && !isInstalled) {
      console.log('App not installed, showing prompt');
      setShowPrompt(true);
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      console.log('beforeinstallprompt event captured');
      e.preventDefault();
      window.deferredPrompt = e as BeforeInstallPromptEvent;
      setShowPrompt(true);
    };

    const handleAppInstalled = () => {
      console.log('App installed event fired');
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
    console.log('Install button clicked');
    if (!window.deferredPrompt) {
      console.log('No deferred prompt available');
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
      console.log('Prompting for installation');
      const promptResult = await window.deferredPrompt.prompt();
      console.log('Prompt result:', promptResult);
      
      if (promptResult.outcome === 'accepted') {
        console.log('User accepted installation');
        localStorage.setItem('pwa-installed', 'true');
        toast({
          title: "Installazione in corso",
          description: "WayWonder sta per essere installata...",
        });
      } else {
        console.log('User dismissed installation');
        toast({
          title: "Installazione annullata",
          description: "Puoi sempre installare WayWonder più tardi dal menu del browser",
        });
      }
    } catch (error) {
      console.error('Error during installation:', error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante l'installazione. Riprova più tardi.",
        variant: "destructive",
      });
    }

    window.deferredPrompt = null;
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
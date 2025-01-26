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
    console.log('PWAInstallPrompt: Component mounted');
    
    // Check if the app is already installed
    const isInstalled = window.matchMedia('(display-mode: standalone)').matches;
    console.log('PWAInstallPrompt: PWA is installed:', isInstalled);

    if (!isInstalled) {
      // Show prompt immediately if not installed
      setShowPrompt(true);
    }

    const handler = (e: Event) => {
      // Prevent the default browser prompt
      e.preventDefault();
      console.log('PWAInstallPrompt: beforeinstallprompt event triggered');
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Listen for successful installation
    window.addEventListener('appinstalled', (e) => {
      console.log('PWAInstallPrompt: App was installed successfully');
      setShowPrompt(false);
      toast({
        title: "Installazione completata",
        description: "WayWonder è stata installata con successo!",
      });
    });

    // Also listen for installation status changes
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    const mediaQueryHandler = (e: MediaQueryListEvent) => {
      if (e.matches) {
        console.log('PWAInstallPrompt: App was installed, hiding prompt');
        setShowPrompt(false);
      }
    };
    mediaQuery.addEventListener('change', mediaQueryHandler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      mediaQuery.removeEventListener('change', mediaQueryHandler);
    };
  }, [toast]);

  const handleInstall = async () => {
    console.log('PWAInstallPrompt: Install button clicked', { deferredPrompt });
    
    if (!deferredPrompt) {
      console.log('PWAInstallPrompt: No installation prompt available, showing manual instructions');
      toast({
        title: "Installazione manuale richiesta",
        description: "Per installare l'app, usa il menu del tuo browser e seleziona 'Installa' o 'Aggiungi alla schermata Home'",
      });
      return;
    }

    try {
      // Show the installation prompt
      console.log('PWAInstallPrompt: Triggering installation prompt');
      const promptResult = await deferredPrompt.prompt();
      console.log('PWAInstallPrompt: Installation prompt shown, waiting for user choice');
      
      // Wait for the user's choice
      const choiceResult = await deferredPrompt.userChoice;
      console.log('PWAInstallPrompt: User choice result:', choiceResult.outcome);
      
      if (choiceResult.outcome === 'accepted') {
        console.log('PWAInstallPrompt: Installation accepted by user');
        toast({
          title: "Installazione in corso",
          description: "WayWonder sta per essere installata...",
        });
      } else {
        console.log('PWAInstallPrompt: Installation dismissed by user');
        toast({
          title: "Installazione annullata",
          description: "Puoi sempre installare WayWonder più tardi dal menu del browser",
        });
      }
    } catch (error) {
      console.error('PWAInstallPrompt: Error during installation:', error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante l'installazione. Riprova più tardi.",
        variant: "destructive",
      });
    }

    // Clear the deferred prompt
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
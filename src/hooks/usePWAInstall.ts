
import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    const checkIfInstalled = () => {
      // Check if running as PWA
      if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) {
        setIsInstalled(true);
        return;
      }
      
      // Check if installed via navigator
      if ('getInstalledRelatedApps' in navigator) {
        // @ts-ignore
        navigator.getInstalledRelatedApps().then((relatedApps: any[]) => {
          if (relatedApps && relatedApps.length > 0) {
            setIsInstalled(true);
          }
        }).catch(() => {
          // Fallback, assume not installed
          setIsInstalled(false);
        });
      }
    };

    checkIfInstalled();

    const handler = (e: Event) => {
      console.log('beforeinstallprompt event fired');
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    const appInstalledHandler = () => {
      console.log('PWA was installed');
      setIsInstalled(true);
      setDeferredPrompt(null);
      setIsInstallable(false);
    };

    window.addEventListener('beforeinstallprompt', handler);
    window.addEventListener('appinstalled', appInstalledHandler);

    // For debugging - check if PWA criteria are met
    console.log('PWA Debug info:', {
      isSecureContext: window.isSecureContext,
      serviceWorkerSupported: 'serviceWorker' in navigator,
      manifestLink: document.querySelector('link[rel="manifest"]'),
      isStandalone: window.matchMedia('(display-mode: standalone)').matches
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      window.removeEventListener('appinstalled', appInstalledHandler);
    };
  }, []);

  const installPWA = async () => {
    console.log('installPWA called', { deferredPrompt, isInstallable, isInstalled });

    if (isInstalled) {
      console.log('PWA already installed');
      return 'already-installed';
    }

    if (!deferredPrompt) {
      console.log('No deferred prompt available');
      return 'not-available';
    }

    try {
      console.log('Showing install prompt');
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      console.log('User choice:', outcome);
      
      if (outcome === 'accepted') {
        setIsInstalled(true);
      }
      
      setDeferredPrompt(null);
      setIsInstallable(false);
      return outcome;
    } catch (error) {
      console.error('Error installing PWA:', error);
      return 'error';
    }
  };

  return {
    isInstallable,
    isInstalled,
    installPWA,
    canInstall: isInstallable && !isInstalled
  };
}

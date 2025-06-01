
import { Download } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { usePWAInstall } from '@/hooks/usePWAInstall';
import { toast } from '@/hooks/use-toast';

export const PWAInstallItem = () => {
  const { t } = useTranslation();
  const { isInstallable, isInstalled, installPWA, canInstall } = usePWAInstall();

  const handleInstall = async () => {
    console.log('PWA Install button clicked');

    if (isInstalled) {
      toast({
        title: t('pwa.alreadyInstalled', 'App già installata'),
        description: t('pwa.alreadyInstalledDesc', 'L\'app è già installata sul tuo dispositivo'),
      });
      return;
    }

    const result = await installPWA();
    
    console.log('Install result:', result);
    
    switch (result) {
      case 'accepted':
        toast({
          title: t('pwa.installSuccess', 'Installazione completata'),
          description: t('pwa.installSuccessDesc', 'L\'app è stata installata con successo'),
        });
        break;
        
      case 'dismissed':
        toast({
          title: t('pwa.installDismissed', 'Installazione annullata'),
          description: t('pwa.installDismissedDesc', 'Puoi riprovare in qualsiasi momento'),
        });
        break;
        
      case 'already-installed':
        toast({
          title: t('pwa.alreadyInstalled', 'App già installata'),
          description: t('pwa.alreadyInstalledDesc', 'L\'app è già installata sul tuo dispositivo'),
        });
        break;
        
      case 'not-available':
        toast({
          title: t('pwa.manualInstall', 'Installazione manuale'),
          description: t('pwa.manualInstallDesc', 'Usa il menu del browser per aggiungere alla schermata home'),
        });
        break;
        
      case 'error':
      default:
        toast({
          title: t('pwa.installError', 'Errore durante l\'installazione'),
          description: t('pwa.installErrorDesc', 'Si è verificato un errore durante l\'installazione'),
        });
        break;
    }
  };

  // Show install option even if not installable for manual instructions
  return (
    <div 
      onClick={handleInstall}
      className="flex items-center gap-2 text-lg hover:text-primary transition-colors cursor-pointer"
    >
      <Download className="h-4 w-4" />
      {isInstalled ? t('menu.appInstalled', 'App Installata') : t('menu.installPWA')}
      {canInstall && <span className="text-xs bg-green-500 text-white px-1 rounded">●</span>}
    </div>
  );
};

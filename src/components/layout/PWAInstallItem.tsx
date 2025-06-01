
import { Download } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { usePWAInstall } from '@/hooks/usePWAInstall';
import { toast } from '@/hooks/use-toast';

export const PWAInstallItem = () => {
  const { t } = useTranslation();
  const { isInstallable, isInstalled, installPWA } = usePWAInstall();

  const handleInstall = async () => {
    if (isInstalled) {
      toast({
        title: t('pwa.alreadyInstalled', 'App già installata'),
        description: t('pwa.alreadyInstalledDesc', 'L\'app è già installata sul tuo dispositivo'),
      });
      return;
    }

    const success = await installPWA();
    
    if (!success && isInstallable) {
      // Show manual installation instructions
      toast({
        title: t('pwa.manualInstall', 'Installazione manuale'),
        description: t('pwa.manualInstallDesc', 'Usa il menu del browser per aggiungere alla schermata home'),
      });
    } else if (!isInstallable) {
      toast({
        title: t('pwa.notSupported', 'Non supportato'),
        description: t('pwa.notSupportedDesc', 'Il tuo browser non supporta l\'installazione PWA'),
      });
    }
  };

  return (
    <div 
      onClick={handleInstall}
      className="flex items-center gap-2 text-lg hover:text-primary transition-colors cursor-pointer"
    >
      <Download className="h-4 w-4" />
      {t('menu.installPWA')}
    </div>
  );
};

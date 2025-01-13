import { useTranslation } from 'react-i18next';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LogoutButtonProps {
  onLogout: () => void;
}

export const LogoutButton = ({ onLogout }: LogoutButtonProps) => {
  const { t } = useTranslation();
  
  return (
    <Button 
      variant="ghost" 
      className="flex items-center justify-start gap-2 text-lg text-red-600 hover:text-red-700 px-0"
      onClick={onLogout}
    >
      <LogOut className="h-4 w-4" />
      {t('menu.logout')}
    </Button>
  );
};
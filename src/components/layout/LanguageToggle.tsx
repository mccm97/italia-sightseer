
import { Button } from '@/components/ui/button';
import { Languages } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface LanguageToggleProps {
  language: string;
  onToggle: () => void;
}

export const LanguageToggle = ({ language, onToggle }: LanguageToggleProps) => {
  const { t, i18n } = useTranslation();
  const buttonText = language === 'it' ? 'English' : 'Italiano';
  
  return (
    <Button 
      variant="ghost" 
      className="flex items-center gap-2"
      onClick={() => {
        onToggle();
        i18n.changeLanguage(language === 'it' ? 'en' : 'it');
      }}
    >
      <Languages className="h-4 w-4" />
      {buttonText}
    </Button>
  );
};

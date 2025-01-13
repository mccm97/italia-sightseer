import { Button } from '@/components/ui/button';
import { Languages } from 'lucide-react';

interface LanguageToggleProps {
  language: string;
  onToggle: () => void;
}

export const LanguageToggle = ({ language, onToggle }: LanguageToggleProps) => {
  const buttonText = language === 'it' ? 'English' : 'Italiano';
  
  return (
    <Button 
      variant="ghost" 
      className="flex items-center gap-2"
      onClick={onToggle}
    >
      <Languages className="h-4 w-4" />
      {buttonText}
    </Button>
  );
};
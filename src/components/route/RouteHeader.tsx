import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface RouteHeaderProps {
  onBack: () => void;
  onCreateRoute: () => void;
}

export function RouteHeader({ 
  onBack, 
  onCreateRoute,
}: RouteHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <Button
        variant="ghost"
        onClick={onBack}
        className="flex items-center gap-2"
      >
        <ArrowLeft className="w-4 h-4" />
        Indietro
      </Button>
      <Button 
        onClick={onCreateRoute}
        className="bg-primary text-white hover:bg-primary/90"
      >
        Crea Percorso
      </Button>
    </div>
  );
}
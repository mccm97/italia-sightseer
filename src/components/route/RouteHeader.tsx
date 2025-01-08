import React from 'react';
import { Button } from '../ui/button';
import { ArrowLeft } from 'lucide-react';

interface RouteHeaderProps {
  onBack: () => void;
  onCreateRoute: () => void;
  screenshotUrl: string | null;
}

export function RouteHeader({ 
  onBack, 
  onCreateRoute,
  screenshotUrl
}: RouteHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <Button 
        variant="outline" 
        onClick={onBack}
        className="flex items-center gap-2"
      >
        <ArrowLeft className="w-4 h-4" />
        Torna indietro
      </Button>
    </div>
  );
}
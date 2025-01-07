import React from 'react';
import { Button } from '../ui/button';
import { ArrowLeft, Camera } from 'lucide-react';

interface RouteHeaderProps {
  onBack: () => void;
  onScreenshotClick: () => void;
  onCreateRoute: () => void;
  screenshotTaken: boolean;
}

export function RouteHeader({ 
  onBack, 
  onScreenshotClick, 
  onCreateRoute, 
  screenshotTaken 
}: RouteHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <Button 
        variant="outline" 
        onClick={onBack}
        className="flex items-center gap-2"
      >
        <ArrowLeft className="w-4 h-4" />
        Torna alla creazione
      </Button>
      <div className="flex gap-2">
        <Button 
          variant="outline"
          onClick={onScreenshotClick}
          className="flex items-center gap-2"
        >
          <Camera className="w-4 h-4" />
          {screenshotTaken ? 'Nuovo Screenshot' : 'Cattura Screenshot'}
        </Button>
        <Button 
          onClick={onCreateRoute}
          className="bg-primary text-white"
          disabled={!screenshotTaken}
        >
          Crea Percorso
        </Button>
      </div>
    </div>
  );
}
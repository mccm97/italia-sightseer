import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

export interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
  social: boolean;
}

interface CookiePreferencesDialogProps {
  showPreferences: boolean;
  preferences: CookiePreferences;
  onPreferencesChange: (preferences: CookiePreferences) => void;
  onClose: () => void;
  onAcceptSelected: () => void;
}

export function CookiePreferencesDialog({
  showPreferences,
  preferences,
  onPreferencesChange,
  onClose,
  onAcceptSelected,
}: CookiePreferencesDialogProps) {
  return (
    <Dialog open={showPreferences} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Preferenze Cookie</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Cookie Essenziali</Label>
              <p className="text-sm text-gray-500">
                Necessari per il funzionamento del sito. Non possono essere disattivati.
              </p>
            </div>
            <Switch checked={true} disabled />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Cookie Analitici</Label>
              <p className="text-sm text-gray-500">
                Ci aiutano a capire come utilizzi il sito.
              </p>
            </div>
            <Switch
              checked={preferences.analytics}
              onCheckedChange={(checked) => 
                onPreferencesChange({ ...preferences, analytics: checked })
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Cookie Marketing</Label>
              <p className="text-sm text-gray-500">
                Utilizzati per mostrarti pubblicità pertinenti.
              </p>
            </div>
            <Switch
              checked={preferences.marketing}
              onCheckedChange={(checked) => 
                onPreferencesChange({ ...preferences, marketing: checked })
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Cookie Social</Label>
              <p className="text-sm text-gray-500">
                Permettono l'integrazione con i social media.
              </p>
            </div>
            <Switch
              checked={preferences.social}
              onCheckedChange={(checked) => 
                onPreferencesChange({ ...preferences, social: checked })
              }
            />
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={onClose}>
              Annulla
            </Button>
            <Button onClick={onAcceptSelected}>
              Accetta selezionati
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
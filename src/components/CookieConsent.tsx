import { useState, useEffect } from 'react';
import CookieConsent from 'react-cookie-consent';
import { Link } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
  social: boolean;
}

export function CookieBanner() {
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true, // Sempre attivo e non modificabile
    analytics: false,
    marketing: false,
    social: false
  });

  // Funzione per gestire l'accettazione dei cookie selezionati
  const handleAcceptSelected = () => {
    localStorage.setItem('waywonder-cookie-consent', 'true');
    localStorage.setItem('waywonder-cookie-preferences', JSON.stringify(preferences));
    
    // Inizializza i servizi in base alle preferenze
    if (preferences.analytics) {
      initializeAnalytics();
    }
    if (preferences.marketing) {
      initializeMarketing();
    }
    if (preferences.social) {
      initializeSocialFeatures();
    }

    setShowPreferences(false);
  };

  // Funzione per gestire l'accettazione di tutti i cookie
  const handleAcceptAll = () => {
    const allPreferences = {
      essential: true,
      analytics: true,
      marketing: true,
      social: true
    };
    
    localStorage.setItem('waywonder-cookie-consent', 'true');
    localStorage.setItem('waywonder-cookie-preferences', JSON.stringify(allPreferences));
    
    // Inizializza tutti i servizi
    initializeAnalytics();
    initializeMarketing();
    initializeSocialFeatures();
  };

  // Funzione per gestire il rifiuto dei cookie
  const handleDecline = () => {
    const minimalPreferences = {
      essential: true,
      analytics: false,
      marketing: false,
      social: false
    };
    
    localStorage.setItem('waywonder-cookie-consent', 'false');
    localStorage.setItem('waywonder-cookie-preferences', JSON.stringify(minimalPreferences));
    
    // Rimuovi tutti i cookie non essenziali
    document.cookie.split(";").forEach(function(c) { 
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
    });
  };

  // Inizializza Google Analytics
  const initializeAnalytics = () => {
    if (typeof window !== 'undefined' && (window as any).initGA) {
      (window as any).initGA();
    }
  };

  // Inizializza servizi di marketing
  const initializeMarketing = () => {
    console.log('Inizializzazione servizi marketing');
  };

  // Inizializza funzionalità social
  const initializeSocialFeatures = () => {
    console.log('Inizializzazione funzionalità social');
  };

  // Controlla lo stato del consenso all'avvio
  useEffect(() => {
    const savedConsent = localStorage.getItem('waywonder-cookie-consent');
    const savedPreferences = localStorage.getItem('waywonder-cookie-preferences');
    
    if (savedConsent === 'true' && savedPreferences) {
      const parsedPreferences = JSON.parse(savedPreferences);
      setPreferences(parsedPreferences);
      
      // Inizializza i servizi in base alle preferenze salvate
      if (parsedPreferences.analytics) initializeAnalytics();
      if (parsedPreferences.marketing) initializeMarketing();
      if (parsedPreferences.social) initializeSocialFeatures();
    }
  }, []);

  return (
    <>
      <CookieConsent
        location="bottom"
        buttonText="Accetta tutti"
        declineButtonText="Rifiuta tutti"
        cookieName="waywonder-cookie-consent"
        style={{ background: "#2B373B" }}
        buttonStyle={{ 
          background: "#4CAF50",
          color: "white",
          fontSize: "13px",
          borderRadius: "3px",
          padding: "5px 15px"
        }}
        declineButtonStyle={{
          background: "#f44336",
          color: "white",
          fontSize: "13px",
          borderRadius: "3px",
          padding: "5px 15px"
        }}
        enableDeclineButton
        onAccept={handleAcceptAll}
        onDecline={handleDecline}
      >
        <div className="flex flex-col gap-2">
          <p>
            Questo sito utilizza i cookie per migliorare la tua esperienza di navigazione.
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setShowPreferences(true)}
              className="text-sm underline text-green-400 hover:text-green-300"
            >
              Personalizza preferenze
            </button>
            <span className="text-sm">
              Per maggiori informazioni, consulta la nostra{" "}
              <Link to="/cookie-policy" className="text-green-400 hover:text-green-300">
                politica sui cookie
              </Link>{" "}
              e la nostra{" "}
              <Link to="/privacy-policy" className="text-green-400 hover:text-green-300">
                informativa sulla privacy
              </Link>.
            </span>
          </div>
        </div>
      </CookieConsent>

      <Dialog open={showPreferences} onOpenChange={setShowPreferences}>
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
                  setPreferences(prev => ({ ...prev, analytics: checked }))
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
                  setPreferences(prev => ({ ...prev, marketing: checked }))
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
                  setPreferences(prev => ({ ...prev, social: checked }))
                }
              />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setShowPreferences(false)}>
                Annulla
              </Button>
              <Button onClick={handleAcceptSelected}>
                Accetta selezionati
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
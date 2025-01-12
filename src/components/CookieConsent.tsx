import { useState, useEffect } from 'react';
import CookieConsent from 'react-cookie-consent';
import { Link } from 'react-router-dom';
import { CookiePreferencesDialog, type CookiePreferences } from './cookie/CookiePreferencesDialog';
import { 
  initializeAnalytics, 
  initializeMarketing, 
  initializeSocialFeatures,
  clearNonEssentialCookies 
} from './cookie/CookieServices';

export function CookieBanner() {
  const [showBanner, setShowBanner] = useState(true);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true,
    analytics: false,
    marketing: false,
    social: false
  });

  const handleAcceptSelected = () => {
    localStorage.setItem('waywonder-cookie-consent', 'true');
    localStorage.setItem('waywonder-cookie-preferences', JSON.stringify(preferences));
    
    if (preferences.analytics) initializeAnalytics();
    if (preferences.marketing) initializeMarketing();
    if (preferences.social) initializeSocialFeatures();

    setShowPreferences(false);
    setShowBanner(false);
  };

  const handleAcceptAll = () => {
    const allPreferences = {
      essential: true,
      analytics: true,
      marketing: true,
      social: true
    };
    
    localStorage.setItem('waywonder-cookie-consent', 'true');
    localStorage.setItem('waywonder-cookie-preferences', JSON.stringify(allPreferences));
    
    initializeAnalytics();
    initializeMarketing();
    initializeSocialFeatures();

    setShowBanner(false);
  };

  const handleDecline = () => {
    const minimalPreferences = {
      essential: true,
      analytics: false,
      marketing: false,
      social: false
    };
    
    localStorage.setItem('waywonder-cookie-consent', 'false');
    localStorage.setItem('waywonder-cookie-preferences', JSON.stringify(minimalPreferences));
    
    clearNonEssentialCookies();
    setShowBanner(false);
  };

  useEffect(() => {
    const savedConsent = localStorage.getItem('waywonder-cookie-consent');
    const savedPreferences = localStorage.getItem('waywonder-cookie-preferences');
    
    if (savedConsent === 'true' && savedPreferences) {
      const parsedPreferences = JSON.parse(savedPreferences);
      setPreferences(parsedPreferences);
      setShowBanner(false);
      
      if (parsedPreferences.analytics) initializeAnalytics();
      if (parsedPreferences.marketing) initializeMarketing();
      if (parsedPreferences.social) initializeSocialFeatures();
    }
  }, []);

  if (!showBanner) return null;

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

      <CookiePreferencesDialog
        showPreferences={showPreferences}
        preferences={preferences}
        onPreferencesChange={setPreferences}
        onClose={() => setShowPreferences(false)}
        onAcceptSelected={handleAcceptSelected}
      />
    </>
  );
}
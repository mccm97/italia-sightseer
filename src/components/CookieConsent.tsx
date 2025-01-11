import CookieConsent from 'react-cookie-consent';
import { useEffect } from 'react';

export function CookieBanner() {
  // Funzione per gestire l'accettazione dei cookie
  const handleAccept = () => {
    // Inizializza GA
    if (typeof window !== 'undefined' && (window as any).initGA) {
      (window as any).initGA();
    }
    // Salva il consenso
    localStorage.setItem('waywonder-cookie-consent', 'true');
  };

  // Funzione per gestire il rifiuto dei cookie
  const handleDecline = () => {
    localStorage.setItem('waywonder-cookie-consent', 'false');
    // Rimuovi eventuali cookie esistenti
    document.cookie.split(";").forEach(function(c) { 
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
    });
  };

  // Controlla lo stato del consenso all'avvio
  useEffect(() => {
    const consent = localStorage.getItem('waywonder-cookie-consent');
    if (consent === 'true') {
      handleAccept();
    }
  }, []);

  return (
    <CookieConsent
      location="bottom"
      buttonText="Accetto"
      declineButtonText="Rifiuto"
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
      expires={150}
      enableDeclineButton
      onAccept={handleAccept}
      onDecline={handleDecline}
    >
      Questo sito utilizza i cookie per migliorare la tua esperienza di navigazione.{" "}
      <span style={{ fontSize: "10px" }}>
        Continuando ad utilizzare questo sito accetti la nostra politica sui cookie.
      </span>
    </CookieConsent>
  );
}
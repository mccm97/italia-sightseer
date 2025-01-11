import CookieConsent from 'react-cookie-consent';

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

export function CookieBanner() {
  return (
    <CookieConsent
      location="bottom"
      buttonText="Accetto"
      declineButtonText="Rifiuto"
      enableDeclineButton
      style={{ 
        background: "rgba(0, 0, 0, 0.9)",
        padding: "1rem",
        zIndex: 9999 
      }}
      buttonStyle={{ 
        background: "#2563eb",
        color: "white",
        fontSize: "14px",
        borderRadius: "0.375rem",
        padding: "0.5rem 1rem"
      }}
      declineButtonStyle={{
        background: "transparent",
        border: "1px solid white",
        color: "white",
        fontSize: "14px",
        borderRadius: "0.375rem",
        padding: "0.5rem 1rem"
      }}
      expires={365}
      onAccept={() => {
        // Abilita Google Analytics solo dopo il consenso
        window.gtag('consent', 'update', {
          'analytics_storage': 'granted'
        });
      }}
      onDecline={() => {
        // Disabilita Google Analytics se l'utente rifiuta
        window.gtag('consent', 'update', {
          'analytics_storage': 'denied'
        });
      }}
    >
      Questo sito utilizza i cookie per migliorare l'esperienza utente. Utilizziamo i cookie per analizzare il traffico del sito e personalizzare i contenuti.{" "}
      <a 
        href="/privacy-policy" 
        style={{ textDecoration: "underline", color: "white" }}
      >
        Privacy Policy
      </a>
    </CookieConsent>
  );
}
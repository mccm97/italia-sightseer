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
      buttonText="Accetta"
      declineButtonText="Rifiuta"
      cookieName="ga-consent"
      style={{ background: "#2B373B" }}
      buttonStyle={{ background: "#4CAF50", color: "white", fontSize: "13px" }}
      declineButtonStyle={{ background: "#f44336", color: "white", fontSize: "13px" }}
      expires={365}
      enableDeclineButton
      onAccept={() => {
        // Abilita Google Analytics
        window.gtag('consent', 'update', {
          'analytics_storage': 'granted'
        });
      }}
      onDecline={() => {
        // Disabilita Google Analytics
        window.gtag('consent', 'update', {
          'analytics_storage': 'denied'
        });
      }}
    >
      Questo sito utilizza i cookie per migliorare la tua esperienza. Continuando a utilizzare questo sito, accetti la nostra politica sui cookie.
    </CookieConsent>
  );
}
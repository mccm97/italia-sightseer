import CookieConsent from 'react-cookie-consent';

export function CookieBanner() {
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
    >
      Questo sito utilizza i cookie per migliorare la tua esperienza di navigazione.{" "}
      <span style={{ fontSize: "10px" }}>
        Continuando ad utilizzare questo sito accetti la nostra politica sui cookie.
      </span>
    </CookieConsent>
  );
}
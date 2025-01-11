import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Informativa sulla Privacy</h1>
      
      <div className="prose prose-sm max-w-none">
        <h2 className="text-2xl font-semibold mt-8 mb-4">1. Introduzione</h2>
        <p>
          La presente Informativa sulla Privacy descrive come WayWonder ("noi", "nostro" o "WayWonder") 
          raccoglie, utilizza e protegge i dati personali degli utenti che visitano il nostro sito web.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">2. Dati raccolti</h2>
        <p>Raccogliamo i seguenti tipi di informazioni:</p>
        <ul className="list-disc pl-6 mb-4">
          <li>Informazioni di registrazione (nome, email)</li>
          <li>Dati di utilizzo del servizio</li>
          <li>Informazioni sul dispositivo e sul browser</li>
          <li>Cookie e tecnologie simili</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">3. Utilizzo dei dati</h2>
        <p>Utilizziamo i dati raccolti per:</p>
        <ul className="list-disc pl-6 mb-4">
          <li>Fornire e migliorare i nostri servizi</li>
          <li>Personalizzare l'esperienza utente</li>
          <li>Comunicare con gli utenti</li>
          <li>Garantire la sicurezza del servizio</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">4. Condivisione dei dati</h2>
        <p>
          Non vendiamo i dati personali degli utenti. Condividiamo i dati solo con:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>Fornitori di servizi che ci aiutano a gestire il sito</li>
          <li>Autorità competenti quando richiesto dalla legge</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">5. Diritti degli utenti</h2>
        <p>Gli utenti hanno il diritto di:</p>
        <ul className="list-disc pl-6 mb-4">
          <li>Accedere ai propri dati personali</li>
          <li>Richiedere la rettifica dei dati</li>
          <li>Richiedere la cancellazione dei dati</li>
          <li>Opporsi al trattamento dei dati</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">6. Contatti</h2>
        <p>
          Per qualsiasi domanda sulla nostra Informativa sulla Privacy, contattaci all'indirizzo: 
          privacy@waywonder.info
        </p>
      </div>

      <div className="mt-8">
        <Button asChild>
          <Link to="/">Torna alla Home</Link>
        </Button>
      </div>
    </div>
  );
}
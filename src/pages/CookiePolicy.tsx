import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function CookiePolicy() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Politica dei Cookie</h1>
      
      <div className="prose prose-sm max-w-none">
        <h2 className="text-2xl font-semibold mt-8 mb-4">1. Cosa sono i cookie</h2>
        <p>
          I cookie sono piccoli file di testo che i siti web salvano sul tuo dispositivo durante la navigazione. 
          Questi file contengono informazioni che vengono riutilizzate durante le visite successive.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">2. Cookie che utilizziamo</h2>
        <h3 className="text-xl font-semibold mt-6 mb-3">Cookie tecnici essenziali</h3>
        <p>
          Questi cookie sono necessari per il funzionamento del sito e non possono essere disattivati. 
          Includono cookie per:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>Gestione della sessione</li>
          <li>Memorizzazione delle preferenze di consenso dei cookie</li>
        </ul>

        <h3 className="text-xl font-semibold mt-6 mb-3">Cookie analitici</h3>
        <p>
          Utilizziamo Google Analytics per comprendere come gli utenti interagiscono con il nostro sito. 
          Questi cookie raccolgono informazioni su:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>Numero di visitatori</li>
          <li>Pagine visitate</li>
          <li>Tempo trascorso sul sito</li>
          <li>Origine del traffico</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">3. Gestione dei cookie</h2>
        <p>
          Puoi gestire le tue preferenze sui cookie attraverso il banner che appare quando visiti il sito 
          per la prima volta. Puoi anche modificare le impostazioni del tuo browser per bloccare o 
          eliminare i cookie.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">4. Cookie di terze parti</h2>
        <p>
          Alcuni cookie di terze parti potrebbero essere impostati da servizi esterni che compaiono 
          sulle nostre pagine:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>Google Analytics (analisi del traffico web)</li>
          <li>Google Tag Manager (gestione dei tag)</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">5. Aggiornamenti</h2>
        <p>
          Questa politica dei cookie potrebbe essere aggiornata periodicamente per riflettere cambiamenti 
          nel nostro utilizzo dei cookie o per altri motivi operativi, legali o normativi.
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
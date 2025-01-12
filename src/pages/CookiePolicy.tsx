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

        <h2 className="text-2xl font-semibold mt-8 mb-4">2. Tipologie di cookie che utilizziamo</h2>
        
        <h3 className="text-xl font-semibold mt-6 mb-3">Cookie tecnici essenziali</h3>
        <p>
          Questi cookie sono necessari per il funzionamento del sito e non possono essere disattivati. 
          Includono cookie per:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>Gestione della sessione</li>
          <li>Memorizzazione delle preferenze di consenso dei cookie</li>
          <li>Funzionalità di base del sito</li>
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
          <li>Comportamento di navigazione</li>
        </ul>

        <h3 className="text-xl font-semibold mt-6 mb-3">Cookie di marketing</h3>
        <p>
          Questi cookie vengono utilizzati per mostrare annunci pubblicitari pertinenti agli utenti. 
          Servono per:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>Mostrare annunci personalizzati</li>
          <li>Misurare l'efficacia delle campagne pubblicitarie</li>
          <li>Evitare di mostrare annunci già visti</li>
        </ul>

        <h3 className="text-xl font-semibold mt-6 mb-3">Cookie social media</h3>
        <p>
          Questi cookie permettono l'integrazione con i social media e la condivisione dei contenuti. 
          Sono utilizzati per:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>Condivisione di contenuti sui social media</li>
          <li>Tracciamento delle interazioni social</li>
          <li>Visualizzazione di contenuti incorporati dai social media</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">3. Gestione dei cookie</h2>
        <p>
          Puoi gestire le tue preferenze sui cookie in diversi modi:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>Attraverso il banner dei cookie che appare quando visiti il sito per la prima volta</li>
          <li>Cliccando sul pulsante "Personalizza preferenze" nel banner dei cookie</li>
          <li>Modificando le impostazioni del tuo browser per bloccare o eliminare i cookie</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">4. Cookie di terze parti</h2>
        <p>
          Alcuni cookie di terze parti potrebbero essere impostati da servizi esterni che compaiono 
          sulle nostre pagine:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>Google Analytics (analisi del traffico web)</li>
          <li>Google Tag Manager (gestione dei tag)</li>
          <li>Social media (Facebook, Twitter, LinkedIn)</li>
          <li>Servizi pubblicitari</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">5. Durata dei cookie</h2>
        <p>
          I cookie hanno diverse durate:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>Cookie di sessione: vengono eliminati quando chiudi il browser</li>
          <li>Cookie persistenti: rimangono sul dispositivo per un periodo specificato</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">6. I tuoi diritti</h2>
        <p>
          Hai il diritto di:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>Accettare o rifiutare l'uso dei cookie non essenziali</li>
          <li>Modificare le tue preferenze in qualsiasi momento</li>
          <li>Richiedere informazioni sui cookie che utilizziamo</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">7. Aggiornamenti</h2>
        <p>
          Questa politica dei cookie potrebbe essere aggiornata periodicamente per riflettere cambiamenti 
          nel nostro utilizzo dei cookie o per altri motivi operativi, legali o normativi.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">8. Contatti</h2>
        <p>
          Per qualsiasi domanda sulla nostra politica dei cookie o sulla gestione delle preferenze, 
          puoi contattarci attraverso i nostri canali ufficiali.
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
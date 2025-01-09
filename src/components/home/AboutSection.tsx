export function AboutSection() {
  return (
    <>
      <section className="bg-gray-100 p-8 rounded-lg shadow-md text-center mb-6">
        <h2 className="text-3xl font-bold mb-6">Chi Siamo</h2>
        <p className="mb-4">
          WayWonder è una piattaforma innovativa che ti aiuta a esplorare le meraviglie del mondo
          attraverso percorsi personalizzati. Scopri le attrazioni culturali, pianifica i tuoi
          itinerari e vivi un'esperienza indimenticabile in qualsiasi destinazione tu scelga.
        </p>
        <p>
          La nostra missione è rendere ogni viaggio un'esperienza unica e memorabile, 
          fornendo gli strumenti necessari per esplorare il mondo in modo intelligente ed efficiente.
          Crediamo che ogni viaggiatore meriti di vivere esperienze autentiche e personalizzate.
        </p>
      </section>
      
      <section className="bg-gray-100 p-8 rounded-lg shadow-md text-center">
        <h2 className="text-3xl font-bold mb-6">I Nostri Servizi</h2>
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-4">Pianificazione Intelligente</h3>
            <ul className="list-none space-y-2">
              <li>Creazione di percorsi personalizzati</li>
              <li>Calcolo ottimizzato di tempi e costi</li>
              <li>Suggerimenti basati sulle tue preferenze</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-4">Esplorazione Globale</h3>
            <ul className="list-none space-y-2">
              <li>Accesso a destinazioni in tutto il mondo</li>
              <li>Informazioni dettagliate sulle attrazioni</li>
              <li>Consigli da viaggiatori locali</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-4">Gestione del Viaggio</h3>
            <ul className="list-none space-y-2">
              <li>Organizzazione completa dell'itinerario</li>
              <li>Gestione delle preferenze di viaggio</li>
              <li>Condivisione di esperienze con altri viaggiatori</li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
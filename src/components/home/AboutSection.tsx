export function AboutSection() {
  return (
    <>
      <section className="bg-gray-100 p-4 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Chi Siamo</h2>
        <p>
          WayWonder è una piattaforma che ti aiuta a esplorare le meraviglie dell'Italia
          attraverso percorsi personalizzati. Scopri le attrazioni culturali, pianifica i tuoi
          itinerari e vivi un'esperienza indimenticabile.
        </p>
      </section>
      <section className="bg-gray-100 p-4 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Cosa Offriamo</h2>
        <ul className="list-disc pl-5">
          <li>Pianificazione di percorsi personalizzati</li>
          <li>Calcolo dei tempi e dei costi</li>
          <li>Visualizzazione delle attrazioni principali</li>
          <li>Consigli sugli itinerari migliori</li>
          <li>Gestione delle tue preferenze di viaggio</li>
        </ul>
      </section>
    </>
  );
}
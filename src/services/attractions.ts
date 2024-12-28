// Questo è un esempio di dati. In un'app reale, questi verrebbero da un'API
const monumentiNapoli = [
  "Castel dell'Ovo",
  "Castel Nuovo (Maschio Angioino)",
  "Castel Sant'Elmo",
  "Castello del Carmine",
  "Palazzo Reale",
  "Teatro San Carlo",
  "Galleria Umberto I",
  "Duomo di Napoli",
  "Cappella Sansevero",
  "Catacombe di San Gennaro"
];

const indirizziNapoli = [
  "Via Partenope, 80132 Napoli NA",
  "Via Vittorio Emanuele III, 80133 Napoli NA",
  "Via Tito Angelini, 20, 80129 Napoli NA",
  "Via Marina, 80133 Napoli NA",
  "Piazza del Plebiscito, 1, 80132 Napoli NA",
  "Via San Carlo, 98, 80132 Napoli NA",
  "Via San Carlo, 80132 Napoli NA",
  "Via Duomo, 147, 80138 Napoli NA",
  "Via Francesco de Sanctis, 19/21, 80134 Napoli NA",
  "Via Capodimonte, 13, 80136 Napoli NA"
];

export const getMonumentSuggestions = (query: string) => {
  const normalizedQuery = query.toLowerCase();
  return monumentiNapoli.filter(monumento => 
    monumento.toLowerCase().includes(normalizedQuery)
  );
};

export const getAddressSuggestions = (query: string) => {
  const normalizedQuery = query.toLowerCase();
  return indirizziNapoli.filter(indirizzo => 
    indirizzo.toLowerCase().includes(normalizedQuery)
  );
};
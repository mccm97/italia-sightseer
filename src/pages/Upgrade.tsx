import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PlanCard } from "@/components/upgrade/PlanCard";
import { Helmet } from 'react-helmet';

const plans = [
  {
    name: "Bronze",
    description: "Piano gratuito per iniziare",
    price: "€0/mese",
    color: "bg-amber-600",
    features: [
      "2 percorsi al mese",
      "Creazione percorsi base",
      "Visualizzazione percorsi pubblici",
      "Profilo utente base",
      "Supporto via email",
    ],
    limitations: [
      "Nessuna indicazione dettagliata",
      "Nessun supporto prioritario",
      "Nessuna funzionalità avanzata",
      "Nessuna personalizzazione avanzata",
      "Nessun accesso API",
    ],
  },
  {
    name: "Silver",
    description: "Per gli esploratori frequenti",
    price: "€29.99/mese",
    color: "bg-gray-400",
    features: [
      "10 percorsi al mese",
      "Indicazioni dettagliate",
      "Supporto prioritario",
      "Profilo utente avanzato",
      "Personalizzazione avanzata dei percorsi",
      "Statistiche dettagliate",
      "Esportazione percorsi",
      "Accesso a funzionalità beta",
    ],
    limitations: [
      "Limite mensile di percorsi",
      "Nessun accesso API",
      "Nessun percorso privato illimitato",
    ],
  },
  {
    name: "Gold",
    description: "Per i veri appassionati",
    price: "€39.99/mese",
    color: "bg-yellow-400",
    features: [
      "Percorsi illimitati",
      "Tutte le funzionalità Silver incluse",
      "Supporto prioritario 24/7",
      "Accesso API completo",
      "Percorsi privati illimitati",
      "Funzionalità esclusive in anteprima",
      "Dashboard personalizzata",
      "Analisi avanzate dei percorsi",
      "Esportazione dati avanzata",
      "Priorità sulle nuove funzionalità",
    ],
    limitations: [],
  },
];

export default function Upgrade() {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Abbonamenti Premium - WayWonder</title>
        <meta name="description" content="Scopri i nostri piani di abbonamento premium. Sblocca funzionalità esclusive e migliora la tua esperienza di viaggio con WayWonder." />
        <meta name="keywords" content="abbonamento premium, piani WayWonder, funzionalità esclusive, upgrade account" />
        <link rel="canonical" href="https://www.waywonder.info/upgrade" />
        <meta property="og:title" content="Abbonamenti Premium - WayWonder" />
        <meta property="og:description" content="Sblocca tutte le funzionalità con un piano premium su WayWonder." />
        <meta property="og:url" content="https://www.waywonder.info/upgrade" />
      </Helmet>
      <div className="container mx-auto py-10">
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)} 
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Indietro
          </Button>
        </div>

        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-4">Scegli il tuo piano</h1>
          <p className="text-xl text-muted-foreground">
            Sblocca tutte le funzionalità con un piano premium
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <PlanCard key={plan.name} {...plan} />
          ))}
        </div>
      </div>
    </>
  );
}
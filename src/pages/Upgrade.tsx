import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PlanCard } from "@/components/upgrade/PlanCard";

const plans = [
  {
    name: "Bronze",
    description: "Piano gratuito per iniziare",
    price: "€0/mese",
    color: "bg-amber-600",
    features: [
      "1 percorso al mese",
      "Funzionalità di base",
      "Supporto via email",
    ],
    limitations: [
      "Nessun percorso aggiuntivo",
      "Nessuna indicazione dettagliata",
      "Nessun supporto prioritario",
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
      "Accesso a funzionalità avanzate",
    ],
    limitations: [
      "Limite mensile di percorsi",
      "Nessun accesso API",
    ],
  },
  {
    name: "Gold",
    description: "Per i veri appassionati",
    price: "€39.99/mese",
    color: "bg-yellow-400",
    features: [
      "Percorsi illimitati",
      "Tutte le funzionalità",
      "Supporto prioritario 24/7",
      "Accesso API completo",
      "Funzionalità esclusive",
    ],
    limitations: [],
  },
];

export default function Upgrade() {
  const navigate = useNavigate();

  return (
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
  );
}
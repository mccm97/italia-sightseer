import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check } from "lucide-react";

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
    price: "€4.99/mese",
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
    price: "€9.99/mese",
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
  return (
    <div className="container mx-auto py-10">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-4">Scegli il tuo piano</h1>
        <p className="text-xl text-muted-foreground">
          Sblocca tutte le funzionalità con un piano premium
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {plans.map((plan) => (
          <Card key={plan.name} className={`relative overflow-hidden ${
            plan.name === "Silver" ? "border-primary" : ""
          }`}>
            <div className={`absolute top-0 left-0 w-full h-1 ${plan.color}`} />
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-6">{plan.price}</div>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Include:</h4>
                  <ul className="space-y-2">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-500" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                {plan.limitations.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2 text-muted-foreground">
                      Non include:
                    </h4>
                    <ul className="space-y-2">
                      {plan.limitations.map((limitation) => (
                        <li key={limitation} className="text-muted-foreground">
                          {limitation}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" disabled>
                {plan.name === "Bronze" ? "Piano Attuale" : "Presto Disponibile"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
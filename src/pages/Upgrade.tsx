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
        <Card>
          <CardHeader>
            <CardTitle>Bronze</CardTitle>
            <CardDescription>Piano gratuito per iniziare</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-6">€0/mese</div>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                <span>1 percorso al mese</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                <span>Funzionalità di base</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full" disabled>Piano Attuale</Button>
          </CardFooter>
        </Card>

        <Card className="border-primary">
          <CardHeader>
            <CardTitle>Silver</CardTitle>
            <CardDescription>Per gli esploratori frequenti</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-6">€4.99/mese</div>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                <span>10 percorsi al mese</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                <span>Indicazioni dettagliate</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                <span>Supporto email</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full" disabled>Presto Disponibile</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Gold</CardTitle>
            <Car

dDescription>Per i veri appassionati</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-6">€9.99/mese</div>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                <span>Percorsi illimitati</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                <span>Tutte le funzionalità</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                <span>Supporto prioritario</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full" disabled>Presto Disponibile</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
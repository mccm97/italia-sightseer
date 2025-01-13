import { Check } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

interface PlanFeature {
  feature: string;
  included: boolean;
}

interface PlanProps {
  name: string;
  description: string;
  price: string;
  color: string;
  features: string[];
  limitations: string[];
}

export function PlanCard({ name, description, price, color, features, limitations }: PlanProps) {
  const { t } = useTranslation();

  const getButtonText = (planName: string) => {
    if (planName === "Bronze") {
      return t('subscriptions.currentPlan');
    }
    return t('subscriptions.comingSoon');
  };

  return (
    <Card className={`relative overflow-hidden ${
      name === "Silver" ? "border-primary" : ""
    }`}>
      <div className={`absolute top-0 left-0 w-full h-1 ${color}`} />
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold mb-6">{price}</div>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">{t('subscriptions.includes')}:</h4>
            <ul className="space-y-2">
              {features.map((feature) => (
                <li key={feature} className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
          {limitations.length > 0 && (
            <div>
              <h4 className="font-medium mb-2 text-muted-foreground">
                {t('subscriptions.notIncludes')}:
              </h4>
              <ul className="space-y-2">
                {limitations.map((limitation) => (
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
          {getButtonText(name)}
        </Button>
      </CardFooter>
    </Card>
  );
}
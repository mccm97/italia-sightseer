import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PlanCard } from "@/components/upgrade/PlanCard";
import { Helmet } from 'react-helmet';
import { useTranslation } from "react-i18next";

const plans = [
  {
    name: "Bronze",
    description: "Free plan to get started",
    price: "€0/month",
    color: "bg-amber-600",
    features: [
      "2 routes per month",
      "Basic route creation",
      "View public routes",
      "Basic user profile",
      "Email support",
    ],
    limitations: [
      "No detailed directions",
      "No priority support",
      "No advanced features",
      "No advanced customization",
      "No API access",
    ],
  },
  {
    name: "Silver",
    description: "For frequent explorers",
    price: "€29.99/month",
    color: "bg-gray-400",
    features: [
      "10 routes per month",
      "Detailed directions",
      "Priority support",
      "Advanced user profile",
      "Advanced route customization",
      "Detailed statistics",
      "Export routes",
      "Access to beta features",
    ],
    limitations: [
      "Monthly route limit",
      "No API access",
      "No unlimited private routes",
    ],
  },
  {
    name: "Gold",
    description: "For true enthusiasts",
    price: "€39.99/month",
    color: "bg-yellow-400",
    features: [
      "Unlimited routes",
      "All Silver features included",
      "24/7 priority support",
      "Full API access",
      "Unlimited private routes",
      "Exclusive preview features",
      "Custom dashboard",
      "Advanced route analytics",
      "Advanced data export",
      "Priority for new features",
    ],
    limitations: [],
  },
];

export default function Upgrade() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <title>{t('subscriptions.title')} - WayWonder</title>
        <meta name="description" content={t('subscriptions.description')} />
        <meta name="keywords" content="premium subscription, WayWonder plans, exclusive features, account upgrade" />
        <link rel="canonical" href="https://www.waywonder.info/upgrade" />
        <meta property="og:title" content={`${t('subscriptions.title')} - WayWonder`} />
        <meta property="og:description" content={t('subscriptions.description')} />
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
            {t('subscriptions.back')}
          </Button>
        </div>

        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-4">{t('subscriptions.title')}</h1>
          <p className="text-xl text-muted-foreground">
            {t('subscriptions.description')}
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
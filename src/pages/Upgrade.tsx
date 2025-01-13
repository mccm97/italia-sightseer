import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PlanCard } from "@/components/upgrade/PlanCard";
import { Helmet } from 'react-helmet';
import { useTranslation } from "react-i18next";

const getPlans = (t: (key: string) => string) => [
  {
    name: t('subscriptions.plans.bronze.name'),
    description: t('subscriptions.plans.bronze.description'),
    price: "€0/month",
    color: "bg-amber-600",
    features: [
      t('subscriptions.plans.bronze.features.routes'),
      t('subscriptions.plans.bronze.features.basic'),
      t('subscriptions.plans.bronze.features.public'),
      t('subscriptions.plans.bronze.features.profile'),
      t('subscriptions.plans.bronze.features.support'),
    ],
    limitations: [
      t('subscriptions.plans.bronze.limitations.directions'),
      t('subscriptions.plans.bronze.limitations.support'),
      t('subscriptions.plans.bronze.limitations.features'),
      t('subscriptions.plans.bronze.limitations.customization'),
      t('subscriptions.plans.bronze.limitations.api'),
    ],
  },
  {
    name: t('subscriptions.plans.silver.name'),
    description: t('subscriptions.plans.silver.description'),
    price: "€29.99/month",
    color: "bg-gray-400",
    features: [
      t('subscriptions.plans.silver.features.routes'),
      t('subscriptions.plans.silver.features.directions'),
      t('subscriptions.plans.silver.features.support'),
      t('subscriptions.plans.silver.features.profile'),
      t('subscriptions.plans.silver.features.customization'),
      t('subscriptions.plans.silver.features.statistics'),
      t('subscriptions.plans.silver.features.export'),
      t('subscriptions.plans.silver.features.beta'),
    ],
    limitations: [
      t('subscriptions.plans.silver.limitations.monthly'),
      t('subscriptions.plans.silver.limitations.api'),
      t('subscriptions.plans.silver.limitations.private'),
    ],
  },
  {
    name: t('subscriptions.plans.gold.name'),
    description: t('subscriptions.plans.gold.description'),
    price: "€39.99/month",
    color: "bg-yellow-400",
    features: [
      t('subscriptions.plans.gold.features.unlimited'),
      t('subscriptions.plans.gold.features.silver'),
      t('subscriptions.plans.gold.features.support'),
      t('subscriptions.plans.gold.features.api'),
      t('subscriptions.plans.gold.features.private'),
      t('subscriptions.plans.gold.features.preview'),
      t('subscriptions.plans.gold.features.dashboard'),
      t('subscriptions.plans.gold.features.analytics'),
      t('subscriptions.plans.gold.features.export'),
      t('subscriptions.plans.gold.features.priority'),
    ],
    limitations: [],
  },
];

export default function Upgrade() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const plans = getPlans(t);

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
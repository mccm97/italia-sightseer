import { Compass, Map, Heart, BookOpen, Crown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { HomeFeatureCard } from './HomeFeatureCard';

export function HomeFeatures() {
  const { t } = useTranslation();

  const mainFeatures = [
    {
      icon: Compass,
      iconColor: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-100 dark:bg-blue-900",
      title: t('home.features.planRoutes.title'),
      description: t('home.features.planRoutes.description'),
      route: '/search',
      delay: 0.2
    },
    {
      icon: Map,
      iconColor: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-100 dark:bg-purple-900",
      title: t('home.features.exploreWorld.title'),
      description: t('home.features.exploreWorld.description'),
      route: '/search',
      delay: 0.4
    },
    {
      icon: Heart,
      iconColor: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-100 dark:bg-green-900",
      title: t('home.features.saveFavorites.title'),
      description: t('home.features.saveFavorites.description'),
      route: '/profile',
      delay: 0.6
    }
  ];

  const additionalFeatures = [
    {
      icon: BookOpen,
      iconColor: "text-amber-600 dark:text-amber-400",
      bgColor: "bg-amber-100 dark:bg-amber-900",
      title: t('home.features.travelBlog.title'),
      description: t('home.features.travelBlog.description'),
      route: '/blog',
      delay: 0.8
    },
    {
      icon: Crown,
      iconColor: "text-rose-600 dark:text-rose-400",
      bgColor: "bg-rose-100 dark:bg-rose-900",
      title: t('home.features.premiumSubscriptions.title'),
      description: t('home.features.premiumSubscriptions.description'),
      route: '/upgrade',
      delay: 1.0
    }
  ];

  return (
    <>
      <div className="grid md:grid-cols-3 gap-6 text-center px-4 pb-12">
        {mainFeatures.map((feature, index) => (
          <HomeFeatureCard key={index} {...feature} />
        ))}
      </div>
      <div className="grid md:grid-cols-2 gap-6 text-center px-4 pb-12">
        {additionalFeatures.map((feature, index) => (
          <HomeFeatureCard key={index} {...feature} />
        ))}
      </div>
    </>
  );
}
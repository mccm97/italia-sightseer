import { HomeHeroTitle } from './HomeHeroTitle';
import { HomeFeatures } from './HomeFeatures';
import { HomeWhySection } from './HomeWhySection';

export const HomeHero = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <HomeHeroTitle />
      <HomeFeatures />
      <HomeWhySection />
    </div>
  );
};
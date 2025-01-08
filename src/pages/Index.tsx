import { HomeHero } from '@/components/home/HomeHero';
import { HomeContainer } from '@/components/home/HomeContainer';
import { AboutSection } from '@/components/home/AboutSection';

export default function Index() {
  return (
    <div className="min-h-screen">
      <HomeHero />
      <div className="container mx-auto px-4 py-12 space-y-12">
        <HomeContainer />
        <AboutSection />
      </div>
    </div>
  );
}
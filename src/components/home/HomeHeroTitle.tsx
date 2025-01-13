import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export function HomeHeroTitle() {
  const { t } = useTranslation();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="max-w-4xl mx-auto space-y-8 py-24 px-4 text-center"
    >
      <h1 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
        {t('home.hero.title')}
      </h1>
      <h2 className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
        {t('home.hero.subtitle')}
      </h2>
      <p className="text-lg text-muted-foreground">
        {t('home.hero.description')}
      </p>
    </motion.div>
  );
}
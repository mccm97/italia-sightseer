import React from 'react';
import { motion } from 'framer-motion';
import { Compass, Map, Heart, BookOpen, Crown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export const HomeHero = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
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
      
      <div className="grid md:grid-cols-3 gap-6 text-center px-4 pb-12">
        <motion.article 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          onClick={() => navigate('/search')}
          className="p-6 space-y-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105"
        >
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto">
            <Compass className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="font-semibold text-lg">{t('home.features.planRoutes.title')}</h3>
          <p className="text-muted-foreground">
            {t('home.features.planRoutes.description')}
          </p>
        </motion.article>
        
        <motion.article 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          onClick={() => navigate('/search')}
          className="p-6 space-y-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105"
        >
          <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto">
            <Map className="h-6 w-6 text-purple-600 dark:text-purple-400" />
          </div>
          <h3 className="font-semibold text-lg">{t('home.features.exploreWorld.title')}</h3>
          <p className="text-muted-foreground">
            {t('home.features.exploreWorld.description')}
          </p>
        </motion.article>
        
        <motion.article 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          onClick={() => navigate('/profile')}
          className="p-6 space-y-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105"
        >
          <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto">
            <Heart className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="font-semibold text-lg">{t('home.features.saveFavorites.title')}</h3>
          <p className="text-muted-foreground">
            {t('home.features.saveFavorites.description')}
          </p>
        </motion.article>
      </div>

      <div className="grid md:grid-cols-2 gap-6 text-center px-4 pb-12">
        <motion.article 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          onClick={() => navigate('/blog')}
          className="p-6 space-y-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105"
        >
          <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900 rounded-full flex items-center justify-center mx-auto">
            <BookOpen className="h-6 w-6 text-amber-600 dark:text-amber-400" />
          </div>
          <h3 className="font-semibold text-lg">{t('home.features.travelBlog.title')}</h3>
          <p className="text-muted-foreground">
            {t('home.features.travelBlog.description')}
          </p>
        </motion.article>

        <motion.article 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          onClick={() => navigate('/upgrade')}
          className="p-6 space-y-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105"
        >
          <div className="w-12 h-12 bg-rose-100 dark:bg-rose-900 rounded-full flex items-center justify-center mx-auto">
            <Crown className="h-6 w-6 text-rose-600 dark:text-rose-400" />
          </div>
          <h3 className="font-semibold text-lg">{t('home.features.premiumSubscriptions.title')}</h3>
          <p className="text-muted-foreground">
            {t('home.features.premiumSubscriptions.description')}
          </p>
        </motion.article>
      </div>

      <section className="max-w-4xl mx-auto px-4 pb-12 text-center">
        <h2 className="text-3xl font-semibold mb-6">
          {t('home.why.title')}
        </h2>
        <div className="prose prose-lg mx-auto dark:prose-invert space-y-6">
          <p>{t('home.why.description1')}</p>
          <p>{t('home.why.description2')}</p>
          <p>{t('home.why.description3')}</p>
        </div>
      </section>
    </div>
  );
};
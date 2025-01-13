import { useTranslation } from 'react-i18next';

export function AboutSection() {
  const { t } = useTranslation();

  return (
    <>
      <section className="bg-gray-100 p-8 rounded-lg shadow-md text-center mb-6">
        <h2 className="text-3xl font-bold mb-6">{t('home.why.title')}</h2>
        <p className="mb-4">{t('home.why.description1')}</p>
        <p>{t('home.why.description2')}</p>
      </section>
      
      <section className="bg-gray-100 p-8 rounded-lg shadow-md text-center">
        <h2 className="text-3xl font-bold mb-6">{t('home.features.title')}</h2>
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-4">{t('home.features.planRoutes.title')}</h3>
            <ul className="list-none space-y-2">
              <li>{t('home.features.planRoutes.description')}</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-4">{t('home.features.exploreWorld.title')}</h3>
            <ul className="list-none space-y-2">
              <li>{t('home.features.exploreWorld.description')}</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-4">{t('home.features.saveFavorites.title')}</h3>
            <ul className="list-none space-y-2">
              <li>{t('home.features.saveFavorites.description')}</li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
import { useTranslation } from 'react-i18next';

export function HomeWhySection() {
  const { t } = useTranslation();

  return (
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
  );
}
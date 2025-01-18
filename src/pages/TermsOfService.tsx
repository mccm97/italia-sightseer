import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';

export default function TermsOfService() {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Helmet>
        <title>WayWonder - {t('terms.title', 'Termini di Servizio')}</title>
        <meta name="description" content={t('terms.description', 'Termini e condizioni di utilizzo di WayWonder')} />
      </Helmet>

      <h1 className="text-3xl font-bold mb-8">{t('terms.title', 'Termini di Servizio')}</h1>

      <div className="prose prose-slate max-w-none">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('terms.introduction.title', '1. Introduzione')}</h2>
          <p>{t('terms.introduction.content', 'Benvenuto su WayWonder. Utilizzando il nostro servizio, accetti di essere vincolato dai seguenti termini e condizioni. Ti invitiamo a leggere attentamente questi termini prima di utilizzare il nostro sito.')}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('terms.services.title', '2. Servizi')}</h2>
          <p>{t('terms.services.content', 'WayWonder offre una piattaforma per la creazione e condivisione di itinerari turistici in Italia. Gli utenti possono seguire altri utenti, creare post di blog, fare commenti e recensioni.')}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('terms.userContent.title', '3. Contenuti degli Utenti')}</h2>
          <p>{t('terms.userContent.content', 'Gli utenti sono responsabili dei contenuti che pubblicano sulla piattaforma. Questo include, ma non è limitato a, testi, immagini, video, commenti e recensioni. Gli utenti devono assicurarsi che i loro contenuti non violino diritti di terzi e non siano offensivi, diffamatori o illegali.')}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('terms.intellectual.title', '4. Proprietà Intellettuale')}</h2>
          <p>{t('terms.intellectual.content', 'Tutti i diritti di proprietà intellettuale relativi al servizio sono di proprietà di WayWonder. Questo include, ma non è limitato a, il design del sito, il logo, i marchi, i testi e le immagini. Gli utenti non possono utilizzare, copiare o distribuire i contenuti di WayWonder senza il nostro permesso scritto.')}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('terms.liability.title', '5. Limitazione di Responsabilità')}</h2>
          <p>{t('terms.liability.content', 'WayWonder non è responsabile per eventuali danni diretti o indiretti derivanti dall\'utilizzo del servizio. Questo include, ma non è limitato a, perdita di dati, interruzione del servizio o problemi tecnici. Gli utenti utilizzano il servizio a proprio rischio.')}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('terms.modifications.title', '6. Modifiche ai Termini')}</h2>
          <p>{t('terms.modifications.content', 'WayWonder si riserva il diritto di modificare questi termini in qualsiasi momento. Le modifiche saranno effettive dal momento della loro pubblicazione sul sito. Gli utenti sono invitati a controllare periodicamente i termini per essere aggiornati su eventuali cambiamenti.')}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{t('terms.contact.title', '7. Contatti')}</h2>
          <p>{t('terms.contact.content', 'Per qualsiasi domanda sui termini di servizio, ti invitiamo a contattarci attraverso il nostro modulo di contatto disponibile sul sito.')}</p>
        </section>
      </div>
    </div>
  );
}
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MotorcycleHero           from '@/components/motorradurlaub/MotorcycleHero';
import MotorcycleIntro          from '@/components/motorradurlaub/MotorcycleIntro';
import MotorcycleBenefits       from '@/components/motorradurlaub/MotorcycleBenefits';
import MotorcycleTripTypes      from '@/components/motorradurlaub/MotorcycleTripTypes';
import MotorcyclePlanningGuide  from '@/components/motorradurlaub/MotorcyclePlanningGuide';
import MotorcycleInternalLinks  from '@/components/motorradurlaub/MotorcycleInternalLinks';
import MotorcycleFAQ            from '@/components/motorradurlaub/MotorcycleFAQ';
import { MOTORCYCLE_FAQ }       from '@/lib/motorradurlaub-config';

export const metadata = {
  title: 'Motorradurlaub planen | Routen, Tipps & Reiseideen',
  description:
    'Plane deinen Motorradurlaub mit ApeAround: schöne Routen, passende Reiseziele, Etappen, Unterkünfte und Tipps für Reisen auf zwei Rädern.',
  openGraph: {
    title: 'Motorradurlaub planen | Routen, Tipps & Reiseideen',
    description:
      'Plane deinen Motorradurlaub mit ApeAround: schöne Routen, passende Reiseziele, Etappen, Unterkünfte und Tipps für Reisen auf zwei Rädern.',
    type: 'website',
  },
};

export default function MotorradUrlaubPage() {
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: MOTORCYCLE_FAQ.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  };

  const webPageJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Motorradurlaub planen | Routen, Tipps & Reiseideen',
    description:
      'Plane deinen Motorradurlaub mit ApeAround: schöne Routen, passende Reiseziele, Etappen, Unterkünfte und Tipps für Reisen auf zwei Rädern.',
    url: 'https://www.apearound.de/motorradurlaub',
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home',           item: 'https://www.apearound.de' },
        { '@type': 'ListItem', position: 2, name: 'Motorradurlaub', item: 'https://www.apearound.de/motorradurlaub' },
      ],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([faqJsonLd, webPageJsonLd]) }}
      />
      <Header />
      <main style={{ minHeight: '100vh', background: '#FFFFFF' }}>
        <MotorcycleHero />
        <MotorcycleIntro />
        <MotorcycleBenefits />
        <MotorcycleTripTypes />
        <MotorcyclePlanningGuide />
        <MotorcycleInternalLinks />
        <MotorcycleFAQ />
      </main>
      <Footer />
    </>
  );
}

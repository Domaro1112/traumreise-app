import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CarRentalHero from '@/components/mietwagen/CarRentalHero';
import CarRentalDestinations from '@/components/mietwagen/CarRentalDestinations';
import CarRentalTips from '@/components/mietwagen/CarRentalTips';
import CarRentalFAQ from '@/components/mietwagen/CarRentalFAQ';
import { CAR_RENTAL_FAQ } from '@/lib/car-rental-config';

export const metadata = {
  title: 'Mietwagen vergleichen – günstige Angebote für deinen Urlaub | Reisemonkey',
  description: 'Vergleiche Mietwagen weltweit und finde das beste Angebot für deinen Urlaub. Mallorca, Kreta, USA und mehr – jetzt günstig buchen über CHECK24.',
  openGraph: {
    title: 'Mietwagen vergleichen – günstige Angebote | Reisemonkey',
    description: 'Finde den besten Mietwagen für deinen nächsten Urlaub – einfach vergleichen und sofort buchen.',
    type: 'website',
  },
};

export default function MietwagenPage() {
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: CAR_RENTAL_FAQ.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  };

  const webPageJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Mietwagen vergleichen – günstige Angebote für deinen Urlaub | Reisemonkey',
    description: 'Vergleiche Mietwagen für deinen Urlaub – Mallorca, Kreta, USA und viele weitere Ziele.',
    url: 'https://www.reisemonkey.de/mietwagen',
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home',      item: 'https://www.reisemonkey.de' },
        { '@type': 'ListItem', position: 2, name: 'Mietwagen', item: 'https://www.reisemonkey.de/mietwagen' },
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
      <main style={{ minHeight: '100vh', paddingTop: '72px', background: '#FFFFFF' }}>
        <CarRentalHero />
        <CarRentalDestinations />
        <CarRentalTips />
        <CarRentalFAQ />
      </main>
      <Footer />
    </>
  );
}

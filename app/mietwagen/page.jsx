import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CarRentalHero from '@/components/mietwagen/CarRentalHero';
import CarRentalDestinations from '@/components/mietwagen/CarRentalDestinations';
import CarRentalProsCons from '@/components/mietwagen/CarRentalProsCons';
import CarRentalTips from '@/components/mietwagen/CarRentalTips';
import CarRentalBookingHints from '@/components/mietwagen/CarRentalBookingHints';
import CarRentalFAQ from '@/components/mietwagen/CarRentalFAQ';
import { CAR_RENTAL_FAQ } from '@/lib/car-rental-config';

export const metadata = {
  title: 'Mietwagen vergleichen – Angebote für deinen Urlaub | Reisemonkey',
  description: 'Mietwagen für deinen Urlaub finden und vergleichen. Mallorca, Kreta, Island, Florida und mehr – mit Tipps zu Versicherung, Tankregelung und Buchung.',
  openGraph: {
    title: 'Mietwagen vergleichen – Angebote für deinen Urlaub | Reisemonkey',
    description: 'Mietwagen für deinen nächsten Urlaub finden – mit Tipps, Hinweisen und den beliebtesten Reisezielen.',
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
    name: 'Mietwagen vergleichen – Angebote für deinen Urlaub | Reisemonkey',
    description: 'Mietwagen für deinen Urlaub finden – mit Tipps, Hinweisen und den beliebtesten Reisezielen.',
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
      <main style={{ minHeight: '100vh', paddingTop: '80px', background: '#FFFFFF' }}>
        <CarRentalHero />
        <CarRentalDestinations />
        <CarRentalProsCons />
        <CarRentalTips />
        <CarRentalBookingHints />
        <CarRentalFAQ />
      </main>
      <Footer />
    </>
  );
}

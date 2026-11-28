import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CarRentalHero from '@/components/mietwagen/CarRentalHero';
import CarRentalDestinations from '@/components/mietwagen/CarRentalDestinations';
import CarRentalProsCons from '@/components/mietwagen/CarRentalProsCons';
import CarRentalTips from '@/components/mietwagen/CarRentalTips';
import CarRentalBookingHints from '@/components/mietwagen/CarRentalBookingHints';
import CarRentalFAQ from '@/components/mietwagen/CarRentalFAQ';
import { CAR_RENTAL_FAQ } from '@/lib/car-rental-config';
import { getHeroFocus } from '@/repositories/hero-images';
import { listPublishedDestinations } from '@/repositories/destinations-cms';
import { CAR_RENTAL_DESTINATIONS as CAR_DESTS } from '@/lib/car-rental-config';

const normName = v => String(v ?? '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ß/g, 'ss').replace(/[^a-z0-9]+/g, ' ').trim();

// Titelbild und Seite der passenden veröffentlichten Reiseziele (über Slug oder Name)
async function carDestinationMedia() {
  const out = {};
  try {
    const list = await listPublishedDestinations();
    for (const c of CAR_DESTS) {
      const d = list.find(x => x.slug === c.id || normName(x.name) === normName(c.name));
      if (d) out[c.id] = { image: d.heroImage && !/unsplash\.com/i.test(d.heroImage) ? d.heroImage : null, slug: d.slug };
    }
  } catch { /* ohne Datenbank: Farbverlauf */ }
  return out;
}

export const revalidate = 60;

export const metadata = {
  title: 'Mietwagen vergleichen – Angebote für deinen Urlaub | ApeAround',
  description: 'Mietwagen für deinen Urlaub finden und vergleichen. Mallorca, Kreta, Island, Florida und mehr – mit Tipps zu Versicherung, Tankregelung und Buchung.',
  openGraph: {
    title: 'Mietwagen vergleichen – Angebote für deinen Urlaub | ApeAround',
    description: 'Mietwagen für deinen nächsten Urlaub finden – mit Tipps, Hinweisen und den beliebtesten Reisezielen.',
    type: 'website',
  },
};

export default async function MietwagenPage() {
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
    name: 'Mietwagen vergleichen – Angebote für deinen Urlaub | ApeAround',
    description: 'Mietwagen für deinen Urlaub finden – mit Tipps, Hinweisen und den beliebtesten Reisezielen.',
    url: 'https://apearound.de/mietwagen',
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home',      item: 'https://apearound.de' },
        { '@type': 'ListItem', position: 2, name: 'Mietwagen', item: 'https://apearound.de/mietwagen' },
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
        <CarRentalHero focus={await getHeroFocus('mietwagen')} />
        <CarRentalDestinations media={await carDestinationMedia()} />
        <CarRentalProsCons />
        <CarRentalTips />
        <CarRentalBookingHints />
        <CarRentalFAQ />
      </main>
      <Footer />
    </>
  );
}

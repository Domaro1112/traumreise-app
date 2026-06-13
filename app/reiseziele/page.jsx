import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ReisezielePageClient from '@/components/destinations/ReisezielePageClient';
import { listPublishedDestinations } from '@/repositories/destinations-cms';

// ISR: re-render from DB every 60 seconds
export const revalidate = 60;

export const metadata = {
  title: 'Reiseziele entdecken – Urlaubsideen & Inspirationen | Reisemonkey',
  description:
    'Entdecke traumhafte Reiseziele weltweit – von Mallorca bis Bali. Mit Highlights, bester Reisezeit, Insider-Tipps und direkten Buchungslinks. Kostenlos & unverbindlich.',
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Reiseziele entdecken | Reisemonkey',
    description:
      'Traumhafte Reiseziele weltweit: Mallorca, Bali, Kreta und weitere Destinationen mit Tipps, Highlights und Angeboten.',
    url: 'https://www.reisemonkey.de/reiseziele',
    type: 'website',
  },
  alternates: {
    canonical: 'https://www.reisemonkey.de/reiseziele',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'Reiseziele entdecken – Reisemonkey',
  description: 'Übersicht über Reiseziele weltweit mit Highlights, Reisetipps und Buchungsangeboten.',
  url: 'https://www.reisemonkey.de/reiseziele',
  breadcrumb: {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Startseite', item: 'https://www.reisemonkey.de' },
      { '@type': 'ListItem', position: 2, name: 'Reiseziele', item: 'https://www.reisemonkey.de/reiseziele' },
    ],
  },
};

export default async function ReisezielePage() {
  let destinations = [];
  try {
    destinations = await listPublishedDestinations();
  } catch { /* Supabase not available — show empty state */ }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main style={{ paddingTop: '72px', background: '#FFFFFF', minHeight: '100vh' }}>
        <ReisezielePageClient destinations={destinations} />
      </main>
      <Footer />
    </>
  );
}

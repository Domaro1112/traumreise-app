import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Container from '@/components/layout/Container';
import DestinationsOverviewGrid from '@/components/destinations/DestinationsOverviewGrid';
import { SEO_DESTINATIONS } from '@/data/destinations-seo';
import { Globe, MapPin } from 'lucide-react';

export const metadata = {
  title: 'Reiseziele entdecken – Urlaubsideen & Inspirationen | Reisemonkey',
  description:
    'Entdecke 20 traumhafte Reiseziele weltweit – von Mallorca bis Bali. Mit Highlights, bester Reisezeit, Insider-Tipps und direkten Buchungslinks.',
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Reiseziele entdecken | Reisemonkey',
    description:
      'Traumhafte Reiseziele weltweit: Mallorca, Bali, Kreta und 17 weitere Destinationen mit Tipps, Highlights und Angeboten.',
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
  description: 'Übersicht über 20 Reiseziele weltweit mit Highlights, Reisetipps und Buchungsangeboten.',
  url: 'https://www.reisemonkey.de/reiseziele',
  breadcrumb: {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Startseite', item: 'https://www.reisemonkey.de' },
      { '@type': 'ListItem', position: 2, name: 'Reiseziele', item: 'https://www.reisemonkey.de/reiseziele' },
    ],
  },
};

const STATS = [
  { value: '20', label: 'Reiseziele' },
  { value: '4', label: 'Kontinente' },
  { value: '100%', label: 'Kostenlos' },
];

export default function ReisezielePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main style={{ paddingTop: '72px', background: '#FFFFFF', minHeight: '100vh' }}>

        {/* ── Hero ── */}
        <section
          style={{
            background: 'linear-gradient(160deg, #0C1A3A 0%, #0B3D6B 50%, #0EA5E9 100%)',
            paddingTop: 'clamp(64px, 8vw, 100px)',
            paddingBottom: 'clamp(48px, 6vw, 80px)',
          }}
        >
          <Container>
            {/* Badge */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', background: 'rgba(14,165,233,0.2)', border: '1px solid rgba(14,165,233,0.4)', borderRadius: '20px', padding: '5px 14px', marginBottom: '20px' }}>
              <Globe size={13} strokeWidth={2} color="#38BDF8" />
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#38BDF8', letterSpacing: '0.5px' }}>Weltweit reisen</span>
            </div>

            <h1
              style={{
                fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                fontSize: 'clamp(30px, 5vw, 60px)',
                fontWeight: 900,
                color: '#FFFFFF',
                letterSpacing: '-0.03em',
                lineHeight: 1.1,
                margin: '0 0 18px',
                maxWidth: '700px',
              }}
            >
              Reiseziele{' '}
              <span style={{ color: '#38BDF8' }}>entdecken</span>
            </h1>

            <p style={{ fontSize: 'clamp(15px, 1.6vw, 19px)', color: 'rgba(255,255,255,0.75)', margin: '0 0 36px', maxWidth: '520px', lineHeight: 1.65 }}>
              Finde Inspiration für deinen nächsten Traumurlaub – mit Highlights, Reisetipps, bester Reisezeit und direkten Buchungslinks.
            </p>

            {/* Stats */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '32px' }}>
              {STATS.map(s => (
                <div key={s.label}>
                  <div style={{ fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 800, color: '#FFFFFF', fontFamily: 'var(--font-heading)', lineHeight: 1 }}>
                    {s.value}
                  </div>
                  <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.60)', marginTop: '3px' }}>
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* ── Grid ── */}
        <section style={{ paddingTop: '56px', paddingBottom: '80px' }}>
          <Container>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <MapPin size={16} strokeWidth={2} color="#0EA5E9" />
              <span style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#0EA5E9' }}>
                Alle Reiseziele
              </span>
            </div>
            <h2
              style={{
                fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                fontSize: 'clamp(22px, 3vw, 34px)',
                fontWeight: 800,
                color: '#0F172A',
                margin: '0 0 8px',
                letterSpacing: '-0.02em',
              }}
            >
              {SEO_DESTINATIONS.length} Reiseziele weltweit
            </h2>
            <p style={{ fontSize: '15px', color: '#64748B', marginBottom: '32px', lineHeight: 1.65 }}>
              Filtere nach Reisetyp und finde dein nächstes Ziel.
            </p>

            <DestinationsOverviewGrid destinations={SEO_DESTINATIONS} />
          </Container>
        </section>

      </main>
      <Footer />
    </>
  );
}

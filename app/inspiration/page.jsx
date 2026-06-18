import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Container from '@/components/layout/Container';
import InspirationGrid from '@/components/inspiration/InspirationGrid';
import { listActiveInspirationItems } from '@/repositories/inspiration-items';
import { FALLBACK_INSPIRATION_ITEMS } from '@/lib/inspiration-items';

export const metadata = {
  title: 'Reiseinspirationen | Hotels, Pauschalreisen & Reiseideen | ApeAround',
  description:
    'Entdecke kuratierte Reiseideen, Hotels, Pauschalreisen, Naturziele und Aktivitäten mit passenden Anbietern zum Vergleichen.',
  openGraph: {
    title: 'Reiseinspirationen | Hotels, Pauschalreisen & Reiseideen | ApeAround',
    description:
      'Entdecke kuratierte Reiseideen, Hotels, Pauschalreisen, Naturziele und Aktivitäten mit passenden Anbietern zum Vergleichen.',
    type: 'website',
  },
};

function JsonLd({ items }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Reiseinspirationen | ApeAround',
    description:
      'Kuratierte Reiseideen, Hotels, Pauschalreisen, Naturziele und Aktivitäten mit passenden Anbietern.',
    hasPart: items.slice(0, 12).map(item => ({
      '@type': 'TouristDestination',
      name: item.title,
      description: item.subtitle || item.description || item.seo_description || '',
      touristType: item.category,
      image: item.image_url?.startsWith('http') ? item.image_url : undefined,
    })),
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Startseite', item: 'https://apearound.de/' },
        { '@type': 'ListItem', position: 2, name: 'Reiseinspirationen', item: 'https://apearound.de/inspiration' },
      ],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default async function InspirationPage() {
  let items = FALLBACK_INSPIRATION_ITEMS;
  try {
    const fromDb = await listActiveInspirationItems();
    if (fromDb.length > 0) items = fromDb;
  } catch {
    // Fallback to static data when DB is unavailable
  }

  return (
    <>
      <JsonLd items={items} />
      <Header />

      <main style={{ background: '#FFFFFF', minHeight: '100vh' }}>
        {/* Hero */}
        <section
          style={{
            position: 'relative',
            paddingTop: 'calc(80px + 80px)',
            paddingBottom: '80px',
            background: 'linear-gradient(135deg, #0F172A 0%, #12324a 55%, #0ea5e9 160%)',
            overflow: 'hidden',
            minHeight: '580px',
          }}
        >
          {/* === responsive image + fade via scoped CSS === */}
          <style>{`
            .insp-hero-img {
              position: absolute;
              top: 0; right: 0; bottom: 0;
              width: 58%;
              background-image: url('/images/inspiration/reisemonkey-inspiration-hero.png');
              background-size: cover;
              background-position: center right;
              background-repeat: no-repeat;
              -webkit-mask-image: linear-gradient(
                to right,
                transparent 0%,
                rgba(0,0,0,0.10) 10%,
                rgba(0,0,0,0.60) 24%,
                black 40%,
                black 100%
              );
              mask-image: linear-gradient(
                to right,
                transparent 0%,
                rgba(0,0,0,0.10) 10%,
                rgba(0,0,0,0.60) 24%,
                black 40%,
                black 100%
              );
              z-index: 0;
            }
            .insp-hero-fade {
              position: absolute;
              top: 0; right: 0; bottom: 0;
              width: 62%;
              background: linear-gradient(
                to right,
                #0F172A 0%,
                rgba(15,23,42,0.72) 16%,
                rgba(15,23,42,0.18) 38%,
                transparent 55%
              );
              z-index: 1;
              pointer-events: none;
            }
            @media (max-width: 900px) {
              .insp-hero-img {
                width: 100%;
                opacity: 0.28;
                -webkit-mask-image: none;
                mask-image: none;
                background-position: center top;
              }
              .insp-hero-fade {
                width: 100%;
                background: linear-gradient(
                  to bottom,
                  rgba(15,23,42,0.55) 0%,
                  rgba(15,23,42,0.45) 100%
                );
              }
            }
          `}</style>

          {/* Bild-Layer rechts */}
          <div className="insp-hero-img" aria-hidden="true" />
          {/* Weicher Fade-Übergang */}
          <div className="insp-hero-fade" aria-hidden="true" />

          {/* Dekorativer Glow-Punkt links unten */}
          <div style={{
            position: 'absolute', bottom: '-15%', left: '-8%',
            width: '480px', height: '480px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(99,102,241,0.10) 0%, transparent 70%)',
            pointerEvents: 'none', zIndex: 0,
          }} />

          <Container>
            {/* Text-Bereich — liegt über Bild-Layern */}
            <div style={{ position: 'relative', zIndex: 2, maxWidth: '640px' }}>
              {/* Label */}
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '6px 16px', borderRadius: '40px',
                background: 'rgba(14,165,233,0.12)', border: '1px solid rgba(14,165,233,0.30)',
                marginBottom: '24px',
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" />
                </svg>
                <span style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#38BDF8', fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)' }}>
                  Handverlesene Reiseideen
                </span>
              </div>

              <h1 style={{
                fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                fontSize: 'clamp(28px, 5vw, 52px)',
                fontWeight: 900,
                lineHeight: 1.15,
                letterSpacing: '-0.03em',
                color: '#FFFFFF',
                margin: '0 0 20px',
              }}>
                Reiseinspirationen,{' '}
                <span style={{
                  background: 'linear-gradient(135deg, #38BDF8 0%, #22D3EE 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>
                  die sofort Fernweh wecken
                </span>
              </h1>

              <p style={{
                fontSize: 'clamp(15px, 1.8vw, 18px)',
                color: '#94A3B8',
                lineHeight: 1.7,
                margin: '0 0 36px',
                maxWidth: '520px',
              }}>
                Entdecke handverlesene Reiseideen, Hotels, Pauschalreisen, Naturziele und Erlebnisse — direkt mit passenden Anbietern zum Vergleichen.
              </p>

              {/* CTAs */}
              <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                <a
                  href="#inspirationen"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                    padding: '14px 26px', borderRadius: '16px',
                    background: 'linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%)',
                    color: '#FFFFFF', textDecoration: 'none',
                    fontSize: '15px', fontWeight: 700,
                    boxShadow: '0 6px 24px rgba(14,165,233,0.45)',
                    fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                  }}
                >
                  Inspiration entdecken
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 5v14M5 12l7 7 7-7" />
                  </svg>
                </a>
                <a
                  href="/#reiseplaner"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                    padding: '14px 26px', borderRadius: '16px',
                    background: 'rgba(255,255,255,0.08)', border: '1.5px solid rgba(255,255,255,0.18)',
                    color: '#E2E8F0', textDecoration: 'none',
                    fontSize: '15px', fontWeight: 600,
                    fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  Traumurlaub planen
                </a>
              </div>

              {/* Stats row */}
              <div style={{
                display: 'flex', gap: '28px', flexWrap: 'wrap',
                marginTop: '48px', paddingTop: '36px',
                borderTop: '1px solid rgba(255,255,255,0.08)',
              }}>
                {[
                  { number: `${items.length}+`, label: 'Reiseideen' },
                  { number: '8+', label: 'Anbieter & Partner' },
                  { number: '100%', label: 'kostenlos' },
                ].map(({ number, label }) => (
                  <div key={label}>
                    <div style={{ fontSize: 'clamp(20px, 2.5vw, 28px)', fontWeight: 900, color: '#38BDF8', fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)', letterSpacing: '-0.02em' }}>
                      {number}
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748B', marginTop: '3px' }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </section>

        {/* Main grid section */}
        <section
          id="inspirationen"
          style={{ paddingTop: '80px', paddingBottom: '80px' }}
        >
          <Container>
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
              <h2 style={{
                fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                fontSize: 'clamp(26px, 4vw, 38px)',
                fontWeight: 800,
                color: '#0F172A',
                margin: '0 0 12px',
                letterSpacing: '-0.025em',
              }}>
                Alle{' '}
                <span style={{
                  background: 'linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>
                  Reiseinspirationen
                </span>
              </h2>
              <p style={{ fontSize: '16px', color: '#64748B', lineHeight: 1.6, maxWidth: '560px', margin: '0 auto' }}>
                Filtere nach Kategorie und entdecke das perfekte Reiseziel für dein nächstes Abenteuer.
              </p>
            </div>

            <InspirationGrid items={items} />
          </Container>
        </section>
      </main>

      <Footer />
    </>
  );
}

import Link from 'next/link';
import { notFound } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Container from '@/components/layout/Container';
import { PARK_PAGES, getParkPageBySlug, getAllParkSlugs } from '@/lib/single-parent-park-pages';

export function generateStaticParams() {
  return getAllParkSlugs().map(slug => ({ anbieter: slug }));
}

export function generateMetadata({ params }) {
  const p = getParkPageBySlug(params.anbieter);
  if (!p) return {};
  return {
    title:       p.seoTitle,
    description: p.seoDescription,
    alternates:  { canonical: `https://apearound.de/urlaub-fuer-alleinerziehende/${p.slug}` },
    openGraph: {
      title:       p.seoTitle,
      description: p.seoDescription,
      url:         `https://apearound.de/urlaub-fuer-alleinerziehende/${p.slug}`,
      siteName:    'ApeAround',
      type:        'article',
    },
  };
}

const CHECK = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const CROSS = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const ARROW = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);

export default function AnbieterPage({ params }) {
  const p = getParkPageBySlug(params.anbieter);
  if (!p) notFound();

  const affiliateHref = `/go/${p.providerKey}?url=${encodeURIComponent(p.defaultTargetUrl)}`;

  const altProviders = (p.alternatives ?? [])
    .map(slug => PARK_PAGES.find(x => x.providerKey === slug || x.slug === slug))
    .filter(Boolean);

  const faqJsonLd = {
    '@context':  'https://schema.org',
    '@type':     'FAQPage',
    mainEntity:  p.faq.map(({ q, a }) => ({
      '@type':          'Question',
      name:             q,
      acceptedAnswer:   { '@type': 'Answer', text: a },
    })),
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type':    'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Startseite',                   item: 'https://apearound.de/' },
      { '@type': 'ListItem', position: 2, name: 'Urlaub für Alleinerziehende',   item: 'https://apearound.de/urlaub-fuer-alleinerziehende' },
      { '@type': 'ListItem', position: 3, name: p.name,                          item: `https://apearound.de/urlaub-fuer-alleinerziehende/${p.slug}` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <Header />
      <main>

        {/* ── 1. HERO ──────────────────────────────────────────────────── */}
        <section style={{
          background: 'linear-gradient(135deg, #0C1B35 0%, #0A3259 60%, #0E4D8A 100%)',
          paddingTop: 'calc(80px + 60px)',
          paddingBottom: '60px',
        }}>
          <Container>
            <div style={{ maxWidth: '700px' }}>
              {/* Breadcrumb */}
              <nav aria-label="Breadcrumb" style={{ marginBottom: '20px' }}>
                <ol style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', listStyle: 'none', padding: 0, margin: 0, fontSize: '13px', color: '#94A3B8' }}>
                  <li><Link href="/" style={{ color: '#94A3B8', textDecoration: 'none' }}>Startseite</Link></li>
                  <li style={{ color: '#475569' }}>/</li>
                  <li><Link href="/urlaub-fuer-alleinerziehende" style={{ color: '#94A3B8', textDecoration: 'none' }}>Urlaub für Alleinerziehende</Link></li>
                  <li style={{ color: '#475569' }}>/</li>
                  <li style={{ color: '#CBD5E1' }}>{p.name}</li>
                </ol>
              </nav>

              {/* Badge */}
              <span style={{
                display: 'inline-block', marginBottom: '20px',
                padding: '5px 14px', borderRadius: '20px',
                background: 'rgba(14,165,233,0.15)', border: '1px solid rgba(14,165,233,0.35)',
                color: '#38BDF8', fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em',
                textTransform: 'uppercase',
                fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
              }}>
                Ratgeber für Alleinerziehende
              </span>

              <h1 style={{
                fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                fontSize: 'clamp(26px, 4.5vw, 46px)', fontWeight: 900,
                color: '#FFFFFF', margin: '0 0 20px', lineHeight: 1.15,
                letterSpacing: '-0.03em',
              }}>
                {p.h1}
              </h1>

              <p style={{ fontSize: 'clamp(15px, 2vw, 18px)', color: '#CBD5E1', lineHeight: 1.75, margin: '0 0 36px', maxWidth: '600px' }}>
                {p.intro}
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                <a
                  href={affiliateHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                    padding: '14px 24px', borderRadius: '12px',
                    background: '#0EA5E9', color: '#FFFFFF',
                    textDecoration: 'none', fontSize: '15px', fontWeight: 700,
                    fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                  }}
                >
                  {p.affiliateButtonLabel} {ARROW}
                </a>
                <Link
                  href="/urlaub-fuer-alleinerziehende/ferienparks-vergleich"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                    padding: '14px 24px', borderRadius: '12px',
                    background: 'rgba(255,255,255,0.10)', border: '1.5px solid rgba(255,255,255,0.25)',
                    color: '#FFFFFF', textDecoration: 'none',
                    fontSize: '15px', fontWeight: 600,
                    fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                  }}
                >
                  Ferienparks vergleichen
                </Link>
              </div>
            </div>
          </Container>
        </section>

        {/* ── 2. KURZFAZIT ─────────────────────────────────────────────── */}
        <section style={{ background: '#FFFFFF', paddingTop: '60px', paddingBottom: '0' }}>
          <Container>
            <div style={{ maxWidth: '760px', margin: '0 auto' }}>
              <div style={{
                background: 'linear-gradient(135deg, #F0FDF4, #ECFDF5)',
                border: '1.5px solid #BBF7D0', borderRadius: '20px',
                padding: 'clamp(24px, 4vw, 40px)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                  <div style={{
                    width: '44px', height: '44px', borderRadius: '12px',
                    background: p.color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '12px', fontWeight: 900, color: p.color, flexShrink: 0,
                    fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                  }}>
                    {p.name.slice(0, 2).toUpperCase()}
                  </div>
                  <h2 style={{
                    fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                    fontSize: 'clamp(18px, 2.5vw, 24px)', fontWeight: 800,
                    color: '#0F172A', margin: 0,
                  }}>
                    Kurzfazit
                  </h2>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
                  <div>
                    <p style={{
                      fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em',
                      textTransform: 'uppercase', color: '#16A34A', margin: '0 0 8px',
                      fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                    }}>
                      Empfehlenswert wenn …
                    </p>
                    <p style={{ fontSize: '15px', color: '#166534', lineHeight: 1.7, margin: 0 }}>
                      {p.summary.proText}
                    </p>
                  </div>
                  <div style={{ borderTop: '1px solid #BBF7D0', paddingTop: '20px' }}>
                    <p style={{
                      fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em',
                      textTransform: 'uppercase', color: '#DC2626', margin: '0 0 8px',
                      fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                    }}>
                      Eher nicht geeignet wenn …
                    </p>
                    <p style={{ fontSize: '15px', color: '#991B1B', lineHeight: 1.7, margin: 0 }}>
                      {p.summary.conText}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* ── 3 + 4. VORTEILE & NACHTEILE ──────────────────────────────── */}
        <section style={{ background: '#FFFFFF', paddingTop: '48px', paddingBottom: '0' }}>
          <Container>
            <div style={{ maxWidth: '760px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>

              {/* Vorteile */}
              <div style={{
                background: '#F0FDF4', border: '1.5px solid #BBF7D0',
                borderRadius: '20px', padding: '32px',
              }}>
                <h2 style={{
                  fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                  fontSize: '20px', fontWeight: 800, color: '#166534', margin: '0 0 20px',
                }}>
                  Vorteile
                </h2>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {p.advantages.map((text, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                      {CHECK}
                      <span style={{ fontSize: '14px', color: '#166534', lineHeight: 1.6 }}>{text}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Nachteile */}
              <div style={{
                background: '#FEF2F2', border: '1.5px solid #FECACA',
                borderRadius: '20px', padding: '32px',
              }}>
                <h2 style={{
                  fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                  fontSize: '20px', fontWeight: 800, color: '#991B1B', margin: '0 0 20px',
                }}>
                  Nachteile
                </h2>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {p.disadvantages.map((text, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                      {CROSS}
                      <span style={{ fontSize: '14px', color: '#991B1B', lineHeight: 1.6 }}>{text}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          </Container>
        </section>

        {/* ── 5. ALTERSEMPFEHLUNG ───────────────────────────────────────── */}
        <section style={{ background: '#FFFFFF', paddingTop: '48px', paddingBottom: '0' }}>
          <Container>
            <div style={{ maxWidth: '760px', margin: '0 auto' }}>
              <h2 style={{
                fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                fontSize: 'clamp(20px, 3vw, 28px)', fontWeight: 800,
                color: '#0F172A', margin: '0 0 8px',
              }}>
                Für welches Kindesalter geeignet?
              </h2>
              <p style={{ fontSize: '14px', color: '#64748B', margin: '0 0 24px', lineHeight: 1.7 }}>
                {p.childAgeRecommendation.notes}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                {[
                  { label: 'Kleinkinder (0–3)', ok: p.childAgeRecommendation.toddlers },
                  { label: 'Grundschulkinder (4–12)', ok: p.childAgeRecommendation.primary },
                  { label: 'Teenager (13+)', ok: p.childAgeRecommendation.teens },
                ].map(({ label, ok }) => (
                  <div key={label} style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    padding: '10px 18px', borderRadius: '12px',
                    background: ok ? '#F0FDF4' : '#FEF2F2',
                    border: `1.5px solid ${ok ? '#BBF7D0' : '#FECACA'}`,
                    fontSize: '13px', fontWeight: 600,
                    color: ok ? '#166534' : '#991B1B',
                  }}>
                    <span style={{ fontSize: '15px' }}>{ok ? '✓' : '✗'}</span>
                    {label}
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </section>

        {/* ── 6. KOSTEN-EINSCHÄTZUNG ───────────────────────────────────── */}
        <section style={{ background: '#F8FAFF', paddingTop: '64px', paddingBottom: '64px', marginTop: '48px' }}>
          <Container>
            <div style={{ maxWidth: '760px', margin: '0 auto' }}>
              <p style={{
                fontSize: '12px', fontWeight: 700, letterSpacing: '0.12em',
                textTransform: 'uppercase', color: '#0EA5E9', margin: '0 0 8px',
                fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
              }}>
                Kosten-Einschätzung
              </p>
              <h2 style={{
                fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                fontSize: 'clamp(20px, 3vw, 28px)', fontWeight: 800,
                color: '#0F172A', margin: '0 0 16px',
              }}>
                Was kostet {p.name}?
              </h2>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '6px 14px', borderRadius: '20px',
                background: '#EFF6FF', border: '1.5px solid #BFDBFE',
                color: '#1D4ED8', fontSize: '13px', fontWeight: 700,
                marginBottom: '20px',
                fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
              }}>
                Budget-Einschätzung: {p.budgetLevel}
              </div>
              <p style={{ fontSize: '15px', color: '#334155', lineHeight: 1.8, margin: '0 0 24px' }}>
                {p.budgetText}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                {[
                  { icon: '📅', text: 'Nebensaison ist deutlich günstiger' },
                  { icon: '🎯', text: 'Frühbuchung lohnt sich' },
                  { icon: '🍳', text: 'Eigene Küche / Selbstversorgung spart Geld' },
                ].map(({ icon, text }) => (
                  <div key={text} style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    padding: '10px 16px', borderRadius: '12px',
                    background: '#FFFFFF', border: '1.5px solid #E2E8F0',
                    fontSize: '13px', color: '#334155',
                  }}>
                    <span>{icon}</span>{text}
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </section>

        {/* ── 7. TIPPS ─────────────────────────────────────────────────── */}
        <section style={{ background: '#FFFFFF', paddingTop: '64px', paddingBottom: '0' }}>
          <Container>
            <div style={{ maxWidth: '760px', margin: '0 auto' }}>
              <p style={{
                fontSize: '12px', fontWeight: 700, letterSpacing: '0.12em',
                textTransform: 'uppercase', color: '#0EA5E9', margin: '0 0 8px',
                fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
              }}>
                Praktische Tipps
              </p>
              <h2 style={{
                fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                fontSize: 'clamp(20px, 3vw, 28px)', fontWeight: 800,
                color: '#0F172A', margin: '0 0 24px',
              }}>
                Tipps für Alleinerziehende mit {p.name}
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {p.tips.map((tip, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'flex-start', gap: '16px',
                    padding: '18px 22px', borderRadius: '16px',
                    background: '#F8FAFF', border: '1.5px solid #E2E8F0',
                  }}>
                    <div style={{
                      width: '28px', height: '28px', borderRadius: '8px',
                      background: p.color + '18', color: p.color,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '12px', fontWeight: 800, flexShrink: 0,
                      fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                    }}>
                      {i + 1}
                    </div>
                    <p style={{ fontSize: '14px', color: '#334155', lineHeight: 1.7, margin: 0 }}>
                      {tip}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </section>

        {/* ── 8. ALTERNATIVEN ──────────────────────────────────────────── */}
        {altProviders.length > 0 && (
          <section style={{ background: '#FFFFFF', paddingTop: '64px', paddingBottom: '0' }}>
            <Container>
              <div style={{ maxWidth: '760px', margin: '0 auto' }}>
                <p style={{
                  fontSize: '12px', fontWeight: 700, letterSpacing: '0.12em',
                  textTransform: 'uppercase', color: '#0EA5E9', margin: '0 0 8px',
                  fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                }}>
                  Alternativen
                </p>
                <h2 style={{
                  fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                  fontSize: 'clamp(20px, 3vw, 28px)', fontWeight: 800,
                  color: '#0F172A', margin: '0 0 24px',
                }}>
                  Alternativen zu {p.name}
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                  {altProviders.map(alt => (
                    <Link
                      key={alt.slug}
                      href={`/urlaub-fuer-alleinerziehende/${alt.slug}`}
                      style={{
                        display: 'flex', flexDirection: 'column', gap: '8px',
                        padding: '20px 22px', borderRadius: '16px',
                        background: alt.bgColor,
                        border: `1.5px solid ${alt.color}30`,
                        textDecoration: 'none',
                      }}
                    >
                      <div style={{
                        width: '36px', height: '36px', borderRadius: '10px',
                        background: alt.color + '25',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '11px', fontWeight: 900, color: alt.color,
                        fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                      }}>
                        {alt.name.slice(0, 2).toUpperCase()}
                      </div>
                      <p style={{
                        fontSize: '15px', fontWeight: 700, color: '#0F172A', margin: 0,
                        fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                      }}>
                        {alt.name}
                      </p>
                      <p style={{ fontSize: '13px', color: '#475569', margin: 0, lineHeight: 1.5 }}>
                        {alt.suitableFor[0]}
                      </p>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: '5px',
                        fontSize: '12px', fontWeight: 700, color: alt.color, marginTop: '4px',
                      }}>
                        Ratgeber lesen {ARROW}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </Container>
          </section>
        )}

        {/* ── 9. FAQ ───────────────────────────────────────────────────── */}
        <section style={{ background: '#F8FAFF', paddingTop: '80px', paddingBottom: '80px', marginTop: '64px' }}>
          <Container>
            <div style={{ maxWidth: '760px', margin: '0 auto' }}>
              <p style={{
                fontSize: '12px', fontWeight: 700, letterSpacing: '0.12em',
                textTransform: 'uppercase', color: '#0EA5E9', margin: '0 0 8px',
                fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
              }}>
                Häufige Fragen
              </p>
              <h2 style={{
                fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                fontSize: 'clamp(20px, 3vw, 28px)', fontWeight: 800,
                color: '#0F172A', margin: '0 0 32px',
              }}>
                FAQ: {p.name} für Alleinerziehende
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {p.faq.map(({ q, a }, i) => (
                  <div key={i} style={{
                    background: '#FFFFFF', border: '1.5px solid #E2E8F0',
                    borderRadius: '16px', padding: '24px 28px',
                  }}>
                    <h3 style={{
                      fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                      fontSize: '15px', fontWeight: 700, color: '#0F172A',
                      margin: '0 0 10px', lineHeight: 1.4,
                    }}>
                      {q}
                    </h3>
                    <p style={{ fontSize: '14px', color: '#475569', lineHeight: 1.8, margin: 0 }}>
                      {a}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </section>

        {/* ── 10. AFFILIATE-HINWEIS + CTA ──────────────────────────────── */}
        <section style={{ background: '#FFFFFF', paddingTop: '64px', paddingBottom: '80px' }}>
          <Container>
            <div style={{ maxWidth: '760px', margin: '0 auto' }}>

              {/* Affiliate-Hinweis */}
              <p style={{
                fontSize: '12px', color: '#94A3B8', margin: '0 0 40px',
                padding: '12px 18px', background: '#F8FAFF',
                border: '1px solid #E2E8F0', borderRadius: '10px',
                lineHeight: 1.7,
              }}>
                <strong>Transparenz-Hinweis:</strong> Einige Links auf dieser Seite können Affiliate-Links sein.
                Wenn du über unsere Links buchst, erhalten wir möglicherweise eine Provision – für dich bleibt der Preis dabei gleich.
                Das hilft uns, ApeAround kostenlos anzubieten.
              </p>

              {/* Final CTA */}
              <div style={{
                background: 'linear-gradient(135deg, #0C1B35 0%, #0A3259 100%)',
                borderRadius: '24px', padding: 'clamp(32px, 5vw, 48px)',
                textAlign: 'center',
              }}>
                <p style={{
                  fontSize: '12px', fontWeight: 700, letterSpacing: '0.1em',
                  textTransform: 'uppercase', color: '#38BDF8', margin: '0 0 12px',
                  fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                }}>
                  {p.name}
                </p>
                <h2 style={{
                  fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                  fontSize: 'clamp(20px, 3vw, 28px)', fontWeight: 800,
                  color: '#FFFFFF', margin: '0 0 16px',
                }}>
                  {p.affiliateButtonLabel}
                </h2>
                <p style={{ fontSize: '15px', color: '#CBD5E1', margin: '0 0 28px', lineHeight: 1.7 }}>
                  Schau dir aktuelle Angebote und verfügbare Parks an.
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center' }}>
                  <a
                    href={affiliateHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: '8px',
                      padding: '14px 28px', borderRadius: '12px',
                      background: '#0EA5E9', color: '#FFFFFF',
                      textDecoration: 'none', fontSize: '15px', fontWeight: 700,
                      fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                    }}
                  >
                    {p.affiliateButtonLabel} {ARROW}
                  </a>
                  <Link
                    href="/urlaub-fuer-alleinerziehende/ferienparks-vergleich"
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: '8px',
                      padding: '14px 24px', borderRadius: '12px',
                      background: 'rgba(255,255,255,0.10)', border: '1.5px solid rgba(255,255,255,0.25)',
                      color: '#FFFFFF', textDecoration: 'none',
                      fontSize: '15px', fontWeight: 600,
                      fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                    }}
                  >
                    Alle Anbieter vergleichen
                  </Link>
                  <Link
                    href="/urlaub-fuer-alleinerziehende"
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: '8px',
                      padding: '14px 24px', borderRadius: '12px',
                      background: 'rgba(255,255,255,0.08)', border: '1.5px solid rgba(255,255,255,0.15)',
                      color: '#94A3B8', textDecoration: 'none',
                      fontSize: '14px', fontWeight: 600,
                      fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                    }}
                  >
                    ← Zurück zur Übersicht
                  </Link>
                </div>
              </div>
            </div>
          </Container>
        </section>

      </main>
      <Footer />
    </>
  );
}

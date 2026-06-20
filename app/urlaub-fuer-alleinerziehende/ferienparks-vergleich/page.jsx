import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Container from '@/components/layout/Container';
import { PARK_PAGES } from '@/lib/single-parent-park-pages';

export const metadata = {
  title: 'Ferienparks für Alleinerziehende im Vergleich | ApeAround',
  description:
    'Center Parcs, Landal, Roompot, TopParken, Sunparks, Eurocamp und NOVASOL im Vergleich: Welcher Ferienpark eignet sich am besten für Alleinerziehende mit Kind?',
  alternates: { canonical: 'https://apearound.de/urlaub-fuer-alleinerziehende/ferienparks-vergleich' },
  openGraph: {
    title:       'Ferienparks für Alleinerziehende im Vergleich | ApeAround',
    description: 'Center Parcs, Landal, Roompot, TopParken, Sunparks, Eurocamp und NOVASOL im Vergleich für Alleinerziehende.',
    url:         'https://apearound.de/urlaub-fuer-alleinerziehende/ferienparks-vergleich',
    siteName:    'ApeAround',
    type:        'article',
  },
};

const ARROW = (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);

const SITUATIONS = [
  {
    icon: '⚡',
    label: 'Bester Anbieter für kurze Auszeiten',
    winner: 'center-parcs',
    reason: 'Center Parcs bietet kompakte Kurztrips ab 3 Nächten mit wetterunabhängigem Aqua Mundo – ideal wenn Zeit knapp ist.',
  },
  {
    icon: '🌲',
    label: 'Bester Anbieter für Natururlaub',
    winner: 'landal',
    reason: 'Landal GreenParks setzt gezielt auf naturnahe Lagen in Wäldern und Bergen – mit Ferienhäusern und mehr Ruhe.',
  },
  {
    icon: '🏖️',
    label: 'Bester Anbieter für Strand & Niederlande',
    winner: 'roompot',
    reason: 'Roompot hat Parks direkt an der niederländischen Küste und in Zeeland – ideal für Sandburg und Rad-Urlaub.',
  },
  {
    icon: '🏕️',
    label: 'Bester Anbieter für Camping & Mobilheim',
    winner: 'eurocamp',
    reason: 'Eurocamp bietet Mobilheim-Urlaub in ganz Europa – für Familien mit Campinggeist und Abenteuerlust.',
  },
  {
    icon: '🐕',
    label: 'Bester Anbieter für Hundeurlaub',
    winner: 'landal',
    reason: 'Landal ist in vielen Parks sehr hundefreundlich – mit gezieltem Filter beim Buchen.',
  },
  {
    icon: '🏡',
    label: 'Bester Anbieter für mehr Privatsphäre',
    winner: 'novasol',
    reason: 'NOVASOL bietet ein eigenes Ferienhaus statt Ferienpark – maximale Freiheit und Privatsphäre für Alleinerziehende.',
  },
];

const FAQ_ITEMS = [
  {
    q: 'Welcher Ferienpark ist am besten für Alleinerziehende mit Kind?',
    a: 'Das hängt stark vom Reisestil ab. Center Parcs ist die unkomplizierteste Wahl für Kurzurlaub mit Kindern 3–12 Jahre. Für Natururlaub mit Hund ist Landal empfehlenswert. Für Strand und Niederlande eignet sich Roompot gut. Wer Privatsphäre sucht, ist mit einem NOVASOL-Ferienhaus gut aufgestellt.',
  },
  {
    q: 'Ist ein Ferienpark günstiger als ein Hotelurlaub für Alleinerziehende?',
    a: 'Das kommt auf den Vergleich an. Ferienparks mit eigener Küche (Landal, NOVASOL, TopParken) können deutlich günstiger sein, weil man keine Restaurantkosten hat. Center Parcs und Sunparks sind pauschal etwas teurer, punkten aber durch das All-in-one-Konzept und sparen Ausflug- und Transportkosten.',
  },
  {
    q: 'Welcher Ferienpark eignet sich für kleine Kinder unter 5 Jahren?',
    a: 'Center Parcs und Sunparks sind mit ihren Indoor-Wasserwelten und übersichtlichen Geländen sehr gut für Kleinkinder geeignet. Landal und NOVASOL eignen sich ebenfalls – die Ferienhäuser bieten viel Platz. Eurocamp ist für Kinder unter 3 Jahren eher anspruchsvoll.',
  },
  {
    q: 'Kann ich als Alleinerziehende auch alleine mit Kind in einem Ferienpark Urlaub machen?',
    a: 'Ja, absolut. Viele Alleinerziehende reisen genau so. Ferienparks sind besonders geeignet, weil alles auf dem Gelände ist, kurze Wege das Handling vereinfachen, und Kinder sich sicher und frei bewegen können. Du musst nicht ständig planen – das Angebot im Park ist oft ausreichend.',
  },
  {
    q: 'Welcher Anbieter hat Parks in Deutschland?',
    a: 'Center Parcs hat mehrere Parks in Deutschland (z.B. Bispingen, Allgäu). Landal hat ebenfalls Parks in Deutschland, zum Beispiel im Harz, an der Nordseeküste oder im Schwarzwald. Eurocamp bietet auch Campingplätze in Deutschland an.',
  },
];

export default function FerienparkVergleichPage() {
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type':    'FAQPage',
    mainEntity: FAQ_ITEMS.map(({ q, a }) => ({
      '@type':        'Question',
      name:           q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type':    'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Startseite',                  item: 'https://apearound.de/' },
      { '@type': 'ListItem', position: 2, name: 'Urlaub für Alleinerziehende', item: 'https://apearound.de/urlaub-fuer-alleinerziehende' },
      { '@type': 'ListItem', position: 3, name: 'Ferienparks im Vergleich',    item: 'https://apearound.de/urlaub-fuer-alleinerziehende/ferienparks-vergleich' },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <Header />
      <main>

        {/* ── HERO IMAGE ───────────────────────────────────────────────── */}
        <section
          aria-hidden="true"
          style={{
            position: 'relative',
            marginTop: '80px',
            width: '100%',
            height: 'clamp(280px, 50vw, 720px)',
            overflow: 'hidden',
          }}
        >
          <Image
            src="/images/urlaub-alleinerziehende/ferienparks-vergleich-hero.png"
            alt="Reisemonkeys vergleichen familienfreundliche Ferienparks für Alleinerziehende mit Kind"
            fill
            priority
            sizes="100vw"
            style={{ objectFit: 'cover', objectPosition: 'center' }}
          />
        </section>

        {/* ── HERO TEXT ────────────────────────────────────────────────── */}
        <section style={{
          background: 'linear-gradient(135deg, #0C1B35 0%, #0A3259 60%, #0E4D8A 100%)',
          paddingTop: '60px',
          paddingBottom: '60px',
        }}>
          <Container>
            <div style={{ maxWidth: '700px' }}>
              <nav aria-label="Breadcrumb" style={{ marginBottom: '20px' }}>
                <ol style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', listStyle: 'none', padding: 0, margin: 0, fontSize: '13px', color: '#94A3B8' }}>
                  <li><Link href="/" style={{ color: '#94A3B8', textDecoration: 'none' }}>Startseite</Link></li>
                  <li style={{ color: '#475569' }}>/</li>
                  <li><Link href="/urlaub-fuer-alleinerziehende" style={{ color: '#94A3B8', textDecoration: 'none' }}>Urlaub für Alleinerziehende</Link></li>
                  <li style={{ color: '#475569' }}>/</li>
                  <li style={{ color: '#CBD5E1' }}>Ferienparks Vergleich</li>
                </ol>
              </nav>

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
                Ferienparks für Alleinerziehende im Vergleich
              </h1>

              <p style={{ fontSize: 'clamp(15px, 2vw, 17px)', color: '#CBD5E1', lineHeight: 1.75, margin: '0 0 16px', maxWidth: '600px' }}>
                Center Parcs, Landal, Roompot, TopParken, Sunparks, Eurocamp, NOVASOL – welcher Anbieter passt zu deiner Situation?
                Dieser Ratgeber hilft dir, die richtige Wahl für deinen Urlaub als Alleinerziehende/r zu treffen.
              </p>
            </div>
          </Container>
        </section>

        {/* ── EINLEITUNG ───────────────────────────────────────────────── */}
        <section style={{ background: '#FFFFFF', paddingTop: '64px', paddingBottom: '0' }}>
          <Container>
            <div style={{ maxWidth: '760px', margin: '0 auto' }}>
              <h2 style={{
                fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                fontSize: 'clamp(20px, 3vw, 28px)', fontWeight: 800,
                color: '#0F172A', margin: '0 0 16px',
              }}>
                Warum Ferienparks für Alleinerziehende oft sinnvoll sind
              </h2>
              <p style={{ fontSize: '15px', color: '#334155', lineHeight: 1.8, margin: '0 0 16px' }}>
                Als Alleinerziehende/r reist du ohne zweite erwachsene Person. Das bedeutet: Du bist allein verantwortlich für Logistik, Unterhaltung und Sicherheit des Kindes – gleichzeitig. Ferienparks können diesen Druck deutlich reduzieren:
              </p>
              <ul style={{ padding: '0 0 0 4px', margin: '0 0 24px', display: 'flex', flexDirection: 'column', gap: '10px', listStyle: 'none' }}>
                {[
                  'Alles auf einem Gelände – keine tägliche Reiseplanung',
                  'Kurze Wege reduzieren den Aufwand mit Kind',
                  'Das Kind kann sich in einer sicheren Umgebung frei bewegen',
                  'Keine Restaurantsuche – die Verpflegung ist unkomplizierter',
                  'Kein Flug nötig – viele Parks sind mit dem Auto erreichbar',
                ].map((t, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '2px' }}>
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    <span style={{ fontSize: '15px', color: '#334155', lineHeight: 1.6 }}>{t}</span>
                  </li>
                ))}
              </ul>
              <p style={{ fontSize: '15px', color: '#334155', lineHeight: 1.8, margin: 0 }}>
                Das bedeutet nicht, dass ein Ferienpark immer die beste Wahl ist – aber für viele Situationen bietet das Konzept echte Entlastung. Der folgende Vergleich hilft dir zu entscheiden.
              </p>
            </div>
          </Container>
        </section>

        {/* ── VERGLEICHSKARTEN ─────────────────────────────────────────── */}
        <section style={{ background: '#F8FAFF', paddingTop: '64px', paddingBottom: '64px', marginTop: '48px' }}>
          <Container>
            <div style={{ maxWidth: '900px', margin: '0 auto' }}>
              <p style={{
                fontSize: '12px', fontWeight: 700, letterSpacing: '0.12em',
                textTransform: 'uppercase', color: '#0EA5E9', margin: '0 0 8px',
                fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
              }}>
                Anbieter im Überblick
              </p>
              <h2 style={{
                fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                fontSize: 'clamp(20px, 3vw, 28px)', fontWeight: 800,
                color: '#0F172A', margin: '0 0 32px',
              }}>
                Alle 7 Anbieter auf einen Blick
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {PARK_PAGES.map(p => (
                  <div key={p.slug} style={{
                    background: '#FFFFFF', border: '1.5px solid #E2E8F0',
                    borderRadius: '20px', overflow: 'hidden',
                    boxShadow: '0 2px 12px rgba(15,23,42,0.04)',
                  }}>
                    {/* Header-Streifen */}
                    <div style={{
                      background: p.bgColor, borderBottom: `2px solid ${p.color}25`,
                      padding: '16px 24px',
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div style={{
                          width: '42px', height: '42px', borderRadius: '12px',
                          background: p.color + '20', flexShrink: 0,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: '12px', fontWeight: 900, color: p.color,
                          fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                        }}>
                          {p.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p style={{
                            fontSize: '17px', fontWeight: 800, color: '#0F172A', margin: 0,
                            fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                          }}>
                            {p.name}
                          </p>
                          <p style={{ fontSize: '12px', color: '#64748B', margin: 0 }}>
                            {p.countries.slice(0, 3).join(', ')}{p.countries.length > 3 ? ' u.a.' : ''}
                          </p>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <span style={{
                          padding: '4px 12px', borderRadius: '20px',
                          background: p.color + '18', border: `1px solid ${p.color}35`,
                          color: p.color, fontSize: '12px', fontWeight: 700,
                          fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                        }}>
                          {p.budgetLevel}
                        </span>
                        <Link
                          href={`/urlaub-fuer-alleinerziehende/${p.slug}`}
                          style={{
                            display: 'inline-flex', alignItems: 'center', gap: '6px',
                            padding: '6px 14px', borderRadius: '10px',
                            background: p.color, color: '#FFFFFF',
                            textDecoration: 'none', fontSize: '12px', fontWeight: 700,
                            fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                          }}
                        >
                          Ratgeber {ARROW}
                        </Link>
                      </div>
                    </div>

                    {/* Body */}
                    <div style={{
                      padding: '20px 24px',
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                      gap: '20px',
                    }}>
                      <div>
                        <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#94A3B8', margin: '0 0 8px' }}>
                          Besonders geeignet für
                        </p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                          {p.suitableFor.slice(0, 3).map(t => (
                            <span key={t} style={{
                              padding: '3px 10px', borderRadius: '20px',
                              background: '#F1F5F9', fontSize: '12px', color: '#334155',
                            }}>
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#16A34A', margin: '0 0 8px' }}>
                          Stärke
                        </p>
                        <p style={{ fontSize: '13px', color: '#166534', margin: 0, lineHeight: 1.5 }}>
                          {p.advantages[0]}
                        </p>
                      </div>

                      <div>
                        <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#DC2626', margin: '0 0 8px' }}>
                          Einschränkung
                        </p>
                        <p style={{ fontSize: '13px', color: '#991B1B', margin: 0, lineHeight: 1.5 }}>
                          {p.disadvantages[0]}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </section>

        {/* ── EMPFEHLUNGEN NACH SITUATION ──────────────────────────────── */}
        <section style={{ background: '#FFFFFF', paddingTop: '64px', paddingBottom: '0' }}>
          <Container>
            <div style={{ maxWidth: '900px', margin: '0 auto' }}>
              <p style={{
                fontSize: '12px', fontWeight: 700, letterSpacing: '0.12em',
                textTransform: 'uppercase', color: '#0EA5E9', margin: '0 0 8px',
                fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
              }}>
                Empfehlungen
              </p>
              <h2 style={{
                fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                fontSize: 'clamp(20px, 3vw, 28px)', fontWeight: 800,
                color: '#0F172A', margin: '0 0 32px',
              }}>
                Welcher Anbieter passt zu deiner Situation?
              </h2>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                {SITUATIONS.map(({ icon, label, winner, reason }) => {
                  const wp = PARK_PAGES.find(p => p.slug === winner);
                  if (!wp) return null;
                  return (
                    <div key={winner + label} style={{
                      background: '#F8FAFF', border: '1.5px solid #E2E8F0',
                      borderRadius: '20px', padding: '24px',
                    }}>
                      <div style={{ fontSize: '28px', marginBottom: '12px' }}>{icon}</div>
                      <p style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#64748B', margin: '0 0 6px' }}>
                        {label}
                      </p>
                      <p style={{
                        fontSize: '16px', fontWeight: 800, color: wp.color, margin: '0 0 8px',
                        fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                      }}>
                        {wp.name}
                      </p>
                      <p style={{ fontSize: '13px', color: '#475569', margin: '0 0 16px', lineHeight: 1.6 }}>
                        {reason}
                      </p>
                      <Link
                        href={`/urlaub-fuer-alleinerziehende/${wp.slug}`}
                        style={{
                          display: 'inline-flex', alignItems: 'center', gap: '6px',
                          fontSize: '12px', fontWeight: 700, color: wp.color,
                          textDecoration: 'none',
                          fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                        }}
                      >
                        Ratgeber lesen {ARROW}
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
          </Container>
        </section>

        {/* ── ALLE ANBIETER LINKS ───────────────────────────────────────── */}
        <section style={{ background: '#FFFFFF', paddingTop: '64px', paddingBottom: '0' }}>
          <Container>
            <div style={{ maxWidth: '900px', margin: '0 auto' }}>
              <h2 style={{
                fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                fontSize: 'clamp(18px, 2.5vw, 24px)', fontWeight: 800,
                color: '#0F172A', margin: '0 0 20px',
              }}>
                Detailratgeber für jeden Anbieter
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px' }}>
                {PARK_PAGES.map(p => (
                  <Link
                    key={p.slug}
                    href={`/urlaub-fuer-alleinerziehende/${p.slug}`}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '10px',
                      padding: '14px 16px', borderRadius: '14px',
                      background: p.bgColor, border: `1.5px solid ${p.color}30`,
                      textDecoration: 'none',
                    }}
                  >
                    <div style={{
                      width: '32px', height: '32px', borderRadius: '8px',
                      background: p.color + '22', flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '10px', fontWeight: 900, color: p.color,
                      fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                    }}>
                      {p.name.slice(0, 2).toUpperCase()}
                    </div>
                    <span style={{
                      fontSize: '13px', fontWeight: 700, color: '#0F172A',
                      fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                    }}>
                      {p.name}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </Container>
        </section>

        {/* ── FAQ ──────────────────────────────────────────────────────── */}
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
                Ferienpark-Urlaub für Alleinerziehende: FAQ
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {FAQ_ITEMS.map(({ q, a }, i) => (
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

        {/* ── CTA ──────────────────────────────────────────────────────── */}
        <section style={{ background: '#FFFFFF', paddingTop: '64px', paddingBottom: '80px' }}>
          <Container>
            <div style={{ maxWidth: '760px', margin: '0 auto' }}>
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
                  ApeAround
                </p>
                <h2 style={{
                  fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                  fontSize: 'clamp(20px, 3vw, 28px)', fontWeight: 800,
                  color: '#FFFFFF', margin: '0 0 14px',
                }}>
                  Finde heraus, welcher Urlaub zu euch passt
                </h2>
                <p style={{ fontSize: '15px', color: '#CBD5E1', margin: '0 0 28px', lineHeight: 1.7 }}>
                  Beantworte ein paar kurze Fragen zu Reisestil, Budget und Alter des Kindes – ApeAround macht einen passenden Vorschlag.
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center' }}>
                  <Link
                    href="/urlaub-fuer-alleinerziehende"
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: '8px',
                      padding: '14px 28px', borderRadius: '12px',
                      background: '#0EA5E9', color: '#FFFFFF',
                      textDecoration: 'none', fontSize: '15px', fontWeight: 700,
                      fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                    }}
                  >
                    Zur Übersichtsseite {ARROW}
                  </Link>
                </div>

                {/* Affiliate-Hinweis */}
                <p style={{ fontSize: '11px', color: '#475569', margin: '24px 0 0', lineHeight: 1.6 }}>
                  Transparenz-Hinweis: Einige Links können Affiliate-Links sein. Für dich bleibt der Preis gleich.
                </p>
              </div>
            </div>
          </Container>
        </section>

      </main>
      <Footer />
    </>
  );
}

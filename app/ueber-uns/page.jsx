import Image from 'next/image';
import Link from 'next/link';
import {
  Zap, UserCheck, Sparkles,
  Bot, Star, BookOpen, Lightbulb,
  Compass, Map, CheckCircle2, ShieldCheck,
  Plane, ArrowRight,
} from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Container from '@/components/layout/Container';
import Button from '@/components/ui/Button';

export const metadata = {
  title: 'ÜberApeAround – Wir machen Reiseplanung persönlicher',
  description:
    'Erfahre mehr überApeAround.de – KI-gestützte Reiseplanung, kostenlos, persönlich und direkt buchbar. Unsere Mission: weniger Suchen, mehr Vorfreude.',
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://reisemonkey.de/#organization',
      name: 'Reisemonkey',
      url: 'https://reisemonkey.de',
      logo: {
        '@type': 'ImageObject',
        url: 'https://reisemonkey.de/images/logo/reisemonkey-logo.png',
      },
      description:
        'KI-gestützte Reiseplanung – kostenlos, persönlich und direkt buchbar.',
      sameAs: ['https://reisemonkey.de'],
    },
    {
      '@type': 'AboutPage',
      '@id': 'https://reisemonkey.de/ueber-uns',
      url: 'https://reisemonkey.de/ueber-uns',
      name: 'ÜberApeAround',
      isPartOf: { '@id': 'https://reisemonkey.de/#organization' },
      description:
        'Wir machen Reiseplanung einfacher, persönlicher und ein bisschen wilder.',
    },
  ],
};

const VALUES = [
  {
    Icon: Zap,
    title: 'Einfachheit',
    text: 'Reiseideen finden, ohne sich durch hunderte Tabs zu klicken. Drei Fragen, ein Ergebnis.',
    color: '#0EA5E9',
    bg: '#EFF6FF',
  },
  {
    Icon: UserCheck,
    title: 'Persönlichkeit',
    text: 'Vorschläge, die zu Stimmung, Budget, Dauer und Reisestil passen — nicht zu irgendjemand.',
    color: '#06B6D4',
    bg: '#ECFEFF',
  },
  {
    Icon: Sparkles,
    title: 'Inspiration',
    text: 'Reisemomente, die Lust machen, direkt loszulegen. Kein leeres Scrollen mehr.',
    color: '#0284C7',
    bg: '#EFF6FF',
  },
];

const LINKS = [
  {
    Icon: Bot,
    title: 'KI-Reisefinder',
    text: 'Dein persönliches Reiseziel in Minuten.',
    href: '/finder',
  },
  {
    Icon: Star,
    title: 'Reise-Zukunfts-Ich',
    text: 'Stell dir vor, wer du auf Reisen sein könntest.',
    href: '/finder',
  },
  {
    Icon: BookOpen,
    title: 'Reiseblog',
    text: 'Geschichten und Tipps für deine nächste Reise.',
    href: '/reiseblog',
  },
  {
    Icon: Lightbulb,
    title: 'Inspiration',
    text: 'Lass dich von Zielen und Ideen überraschen.',
    href: '/inspiration',
  },
];

const TRUST = [
  'Kostenlose Nutzung — kein Abo, kein Haken.',
  'Keine Anmeldung nötig für Reisevorschläge.',
  'KI-gestützte Inspiration, die wirklich passt.',
  'Direkte Buchungsmöglichkeiten über Partnerlinks.',
  'Transparente Affiliate-Hinweise ohne Mehrkosten für dich.',
];

export default function UeberUns() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main style={{ paddingTop: '80px', background: '#FFFFFF', minHeight: '100vh' }}>

        {/* ── 1. HERO ─────────────────────────────────────────────────────── */}
        <section
          className="about-hero"
          style={{
            background: 'linear-gradient(160deg, #F8FAFF 0%, #EFF6FF 40%, #ECFEFF 100%)',
            paddingTop: '80px',
            paddingBottom: '80px',
            overflow: 'hidden',
          }}
        >
          <Container>
            <div className="about-hero-grid">
              {/* Text */}
              <div>
                {/* Badge */}
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 18px',
                    borderRadius: '24px',
                    background: 'rgba(14,165,233,0.12)',
                    border: '1px solid rgba(14,165,233,0.3)',
                    fontSize: '12px',
                    fontWeight: 700,
                    letterSpacing: '1.5px',
                    textTransform: 'uppercase',
                    color: '#0284C7',
                    fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                    marginBottom: '24px',
                  }}
                >
                  ÜberApeAround
                </div>

                <h1
                  style={{
                    fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                    fontSize: 'clamp(28px, 4.5vw, 54px)',
                    fontWeight: 800,
                    color: '#0F172A',
                    lineHeight: 1.15,
                    letterSpacing: '-0.02em',
                    marginBottom: '24px',
                  }}
                >
                  Wir machen Reiseplanung{' '}
                  <span
                    style={{
                      background: 'linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    einfacher, persönlicher
                  </span>{' '}
                  und ein bisschen wilder.
                </h1>

                <p
                  style={{
                    fontSize: 'clamp(15px, 1.8vw, 18px)',
                    color: '#475569',
                    lineHeight: 1.8,
                    marginBottom: '40px',
                    maxWidth: '540px',
                  }}
                >
                 ApeAround ist entstanden, weil Reiseplanung oft komplizierter ist als die Reise selbst.
                  Wir wollten einen Ort schaffen, der Inspiration, KI-Unterstützung und echte
                  Buchungsmöglichkeiten verbindet — schnell, verständlich und mit Spaß.
                </p>

                <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                  <Button href="/finder" size="lg">
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Plane size={17} strokeWidth={2} />
                      Reise finden
                    </span>
                  </Button>
                  <Button
                    href="/reiseblog"
                    size="lg"
                    style={{
                      background: '#fff',
                      border: '1.5px solid #BFDBFE',
                      color: '#0284C7',
                      boxShadow: '0 2px 8px rgba(14,165,233,0.08)',
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <BookOpen size={17} strokeWidth={2} />
                      Reiseblog entdecken
                    </span>
                  </Button>
                </div>
              </div>

              {/* Image */}
              <div className="about-hero-img-wrap">
                <Image
                  src="/images/about/reisemonkey-founders.png"
                  alt="Die Gründer vonApeAround als Reiseaffen"
                  className="about-hero-img"
                  width={1672}
                  height={941}
                  loading="eager"
                  fetchPriority="high"
                  style={{
                    width: '100%',
                    height: 'auto',
                    borderRadius: '24px',
                    boxShadow: '0 20px 64px rgba(14,165,233,0.15), 0 8px 24px rgba(15,23,42,0.10)',
                    display: 'block',
                  }}
                />
              </div>
            </div>
          </Container>
        </section>

        {/* ── 2. WARUMApeAround ────────────────────────────────────────── */}
        <section style={{ paddingTop: '96px', paddingBottom: '96px', background: '#FFFFFF' }}>
          <Container size="sm">
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '5px 16px',
                borderRadius: '20px',
                background: '#EFF6FF',
                border: '1px solid #BFDBFE',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '2px',
                textTransform: 'uppercase',
                color: '#0284C7',
                fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                marginBottom: '24px',
              }}
            >
              Unsere Geschichte
            </div>

            <h2
              style={{
                fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                fontSize: 'clamp(24px, 3.5vw, 40px)',
                fontWeight: 700,
                color: '#0F172A',
                lineHeight: 1.2,
                marginBottom: '32px',
                letterSpacing: '-0.02em',
              }}
            >
              Warum wirApeAround{' '}
              <span
                style={{
                  background: 'linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                gestartet haben
              </span>
            </h2>

            <div style={{ fontSize: '17px', color: '#475569', lineHeight: 1.9, maxWidth: '680px' }}>
              <p style={{ marginBottom: '20px' }}>
                Viele Menschen wissen, dass sie reisen möchten — aber nicht wohin. Sie vergleichen
                stundenlang Hotels, Flüge, Portale, Bewertungen und Angebote. Am Ende bleibt oft mehr
                Unsicherheit als Vorfreude.
              </p>
              <p style={{ marginBottom: '20px' }}>
                Genau hier setztApeAround an: Wir möchten Reiseplanung wieder leicht machen. Nicht mit
                endlosen Listen, sondern mit passenden Vorschlägen, klaren Empfehlungen und direktem Zugang
                zu Flügen, Hotels, Aktivitäten und Pauschalreisen.
              </p>
              <p>
                Wir glauben, dass die beste Reise nicht die teuerste ist — sondern die, die wirklich zu dir
                passt. Und genau dabei helfen wir.
              </p>
            </div>
          </Container>
        </section>

        {/* ── 3. WERTE ────────────────────────────────────────────────────── */}
        <section
          style={{
            paddingTop: '80px',
            paddingBottom: '80px',
            background: '#F8FAFF',
          }}
        >
          <Container>
            <div style={{ textAlign: 'center', marginBottom: '56px' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '5px 16px',
                  borderRadius: '20px',
                  background: '#EFF6FF',
                  border: '1px solid #BFDBFE',
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  color: '#0284C7',
                  fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                  marginBottom: '16px',
                }}
              >
                Unsere Werte
              </div>
              <h2
                style={{
                  fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                  fontSize: 'clamp(24px, 3.5vw, 38px)',
                  fontWeight: 700,
                  color: '#0F172A',
                  lineHeight: 1.2,
                  letterSpacing: '-0.02em',
                }}
              >
                Was uns antreibt
              </h2>
            </div>

            <div className="about-values-grid">
              {VALUES.map(({ Icon, title, text, color, bg }) => (
                <div
                  key={title}
                  style={{
                    background: '#fff',
                    border: '1.5px solid #E2E8F0',
                    borderRadius: '20px',
                    padding: '36px 28px',
                    boxShadow: '0 4px 20px rgba(15,23,42,0.06)',
                  }}
                >
                  <div
                    style={{
                      width: '52px',
                      height: '52px',
                      borderRadius: '14px',
                      background: bg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '20px',
                    }}
                  >
                    <Icon size={24} strokeWidth={2} color={color} />
                  </div>
                  <h3
                    style={{
                      fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                      fontSize: '18px',
                      fontWeight: 700,
                      color: '#0F172A',
                      marginBottom: '10px',
                    }}
                  >
                    {title}
                  </h3>
                  <p style={{ fontSize: '15px', color: '#64748B', lineHeight: 1.7 }}>{text}</p>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* ── 4. GRÜNDER / MARKEN-BEREICH ─────────────────────────────────── */}
        <section
          style={{
            paddingTop: '96px',
            paddingBottom: '96px',
            background: 'linear-gradient(135deg, #0A1628 0%, #0E2246 50%, #0B2D5E 100%)',
          }}
        >
          <Container>
            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '5px 16px',
                  borderRadius: '20px',
                  background: 'rgba(14,165,233,0.2)',
                  border: '1px solid rgba(14,165,233,0.4)',
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  color: '#7DD3FC',
                  fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                  marginBottom: '20px',
                }}
              >
                Das Team
              </div>
              <h2
                style={{
                  fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                  fontSize: 'clamp(24px, 3.5vw, 40px)',
                  fontWeight: 700,
                  color: '#fff',
                  lineHeight: 1.2,
                  letterSpacing: '-0.02em',
                  marginBottom: '20px',
                }}
              >
                Zwei Reiseaffen mit einer Idee
              </h2>
              <p
                style={{
                  fontSize: 'clamp(15px, 1.8vw, 18px)',
                  color: 'rgba(255,255,255,0.72)',
                  lineHeight: 1.8,
                  maxWidth: '620px',
                  margin: '0 auto',
                }}
              >
                HinterApeAround steht die Idee, Reiseplanung persönlicher und greifbarer zu machen.
                Die Plattform verbindet moderne KI mit echter Reisesehnsucht: weniger Suchen, mehr Vorfreude.
              </p>
            </div>

            <div className="about-founders-grid">
              {[
                {
                  Icon: Compass,
                  role: 'Der Entdecker',
                  desc: 'Immer auf der Suche nach dem nächsten unvergesslichen Reisemoment. Liebt spontane Routen, neue Kulturen und den ersten Kaffee mit Meeresblick.',
                  color: '#38BDF8',
                },
                {
                  Icon: Map,
                  role: 'Der Planer',
                  desc: 'Findet das perfekte Hotel, den besten Flug und das optimale Timing — bevor du überhaupt weißt, dass du verreisen willst.',
                  color: '#06B6D4',
                },
              ].map(({ Icon, role, desc, color }) => (
                <div
                  key={role}
                  style={{
                    background: 'rgba(255,255,255,0.07)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: '20px',
                    padding: '36px 32px',
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  <div
                    style={{
                      width: '52px',
                      height: '52px',
                      borderRadius: '14px',
                      background: 'rgba(14,165,233,0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '20px',
                    }}
                  >
                    <Icon size={24} strokeWidth={2} color={color} />
                  </div>
                  <h3
                    style={{
                      fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                      fontSize: '20px',
                      fontWeight: 700,
                      color: '#fff',
                      marginBottom: '12px',
                    }}
                  >
                    {role}
                  </h3>
                  <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.68)', lineHeight: 1.75 }}>
                    {desc}
                  </p>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* ── 5. PLATTFORM-LINKS ──────────────────────────────────────────── */}
        <section style={{ paddingTop: '96px', paddingBottom: '96px', background: '#FFFFFF' }}>
          <Container>
            <div style={{ textAlign: 'center', marginBottom: '56px' }}>
              <h2
                style={{
                  fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                  fontSize: 'clamp(24px, 3.5vw, 38px)',
                  fontWeight: 700,
                  color: '#0F172A',
                  lineHeight: 1.2,
                  letterSpacing: '-0.02em',
                  marginBottom: '12px',
                }}
              >
                Starte deine Reise mit{' '}
                <span
                  style={{
                    background: 'linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                 ApeAround
                </span>
              </h2>
              <p style={{ fontSize: '16px', color: '#64748B', lineHeight: 1.7 }}>
                Alles an einem Ort — von der Idee bis zur Buchung.
              </p>
            </div>

            <div className="about-links-grid">
              {LINKS.map(({ Icon, title, text, href }) => (
                <Link key={title} href={href} className="about-link-card">
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, #EFF6FF 0%, #ECFEFF 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Icon size={20} strokeWidth={2} color="#0EA5E9" />
                  </div>
                  <div>
                    <div
                      style={{
                        fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                        fontSize: '16px',
                        fontWeight: 700,
                        color: '#0F172A',
                        marginBottom: '6px',
                      }}
                    >
                      {title}
                    </div>
                    <div style={{ fontSize: '13px', color: '#64748B', lineHeight: 1.6 }}>{text}</div>
                  </div>
                  <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: '#0EA5E9', fontWeight: 600 }}>
                    Entdecken <ArrowRight size={14} strokeWidth={2.5} />
                  </div>
                </Link>
              ))}
            </div>
          </Container>
        </section>

        {/* ── 6. VERTRAUEN & TRANSPARENZ ──────────────────────────────────── */}
        <section
          style={{
            paddingTop: '80px',
            paddingBottom: '96px',
            background: 'linear-gradient(160deg, #F8FAFF 0%, #EFF6FF 100%)',
          }}
        >
          <Container size="sm">
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '5px 16px',
                  borderRadius: '20px',
                  background: '#EFF6FF',
                  border: '1px solid #BFDBFE',
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  color: '#0284C7',
                  fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                  marginBottom: '16px',
                }}
              >
                Transparenz
              </div>
              <h2
                style={{
                  fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                  fontSize: 'clamp(22px, 3vw, 36px)',
                  fontWeight: 700,
                  color: '#0F172A',
                  lineHeight: 1.2,
                  letterSpacing: '-0.02em',
                }}
              >
                Was du beiApeAround erwarten kannst
              </h2>
            </div>

            <div
              style={{
                background: '#fff',
                border: '1.5px solid #E2E8F0',
                borderRadius: '24px',
                padding: 'clamp(32px, 5vw, 52px)',
                boxShadow: '0 8px 32px rgba(15,23,42,0.06)',
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '36px' }}>
                {TRUST.map((item) => (
                  <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                    <CheckCircle2
                      size={20}
                      strokeWidth={2}
                      color="#0EA5E9"
                      style={{ flexShrink: 0, marginTop: '2px' }}
                    />
                    <span style={{ fontSize: '16px', color: '#334155', lineHeight: 1.7, fontWeight: 500 }}>
                      {item}
                    </span>
                  </div>
                ))}
              </div>

              <div
                style={{
                  padding: '20px 24px',
                  borderRadius: '14px',
                  background: '#F8FAFF',
                  border: '1px solid #BFDBFE',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                }}
              >
                <ShieldCheck size={18} strokeWidth={2} color="#64748B" style={{ flexShrink: 0, marginTop: '2px' }} />
                <p style={{ fontSize: '13px', color: '#64748B', lineHeight: 1.7 }}>
                  <strong style={{ color: '#475569' }}>Affiliate-Hinweis:</strong> Einige Links auf dieser
                  Website können Affiliate-Links sein. Für dich entstehen dadurch keine Mehrkosten. Wir
                  erhalten gegebenenfalls eine kleine Provision, die uns hilft, die Plattform kostenlos
                  anzubieten.
                </p>
              </div>

              <div style={{ textAlign: 'center', marginTop: '40px' }}>
                <Button href="/finder" size="lg">
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Plane size={17} strokeWidth={2} />
                    Traumreise finden
                  </span>
                </Button>
              </div>
            </div>
          </Container>
        </section>

      </main>
      <Footer />
    </>
  );
}

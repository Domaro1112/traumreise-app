import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Container from '@/components/layout/Container';
import PartnerInquiryForm from '@/components/partner/PartnerInquiryForm';
import PartnerHeroImage from '@/components/partner/PartnerHeroImage';

export const metadata = {
  title: 'Partner werden | Mit ApeAround zusammenarbeiten',
  description:
    'Werde Partner von ApeAround und erreiche Reisende mit Hotels, Reiseangeboten, Erlebnissen, Regionen oder Affiliate-Angeboten in einem modernen KI-Reiseumfeld.',
  openGraph: {
    title: 'Partner werden | ApeAround',
    description: 'Hotels, Reiseanbieter, Tourismusregionen und mehr — partner mit ApeAround und erreiche Reisende im richtigen Moment.',
    url: 'https://apearound.de/partner-werden',
    siteName: 'ApeAround',
    type: 'website',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://apearound.de/#organization',
      name: 'ApeAround',
      url: 'https://apearound.de',
      logo: { '@type': 'ImageObject', url: 'https://apearound.de/images/logo/reisemonkey-logo.png' },
    },
    {
      '@type': 'ContactPage',
      '@id': 'https://apearound.de/partner-werden',
      url: 'https://apearound.de/partner-werden',
      name: 'Partner werden | ApeAround',
      description: 'Kooperationsanfragen für Hotels, Reiseanbieter, Tourismusregionen und Affiliate-Partner.',
      isPartOf: { '@id': 'https://apearound.de/#organization' },
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Wer kann Partner von ApeAround werden?',
          acceptedAnswer: { '@type': 'Answer', text: 'Hotels, Ferienwohnungen, Reiseveranstalter, Mietwagenanbieter, Tourenanbieter, Tourismusregionen, Nationalparks, Städte, Freizeitparks, Erlebnisanbieter und Affiliate-Netzwerke können Partner von ApeAround werden.' },
        },
        {
          '@type': 'Question',
          name: 'Wie funktioniert eine Affiliate-Partnerschaft?',
          acceptedAnswer: { '@type': 'Answer', text: 'Partnerlinks werden über das ApeAround-Redirect-System in passende Reiseinspirationen, Anbieterflächen oder Reisevorschläge eingebunden. Wenn Nutzer über solche Links zu einem Anbieter wechseln, kann ApeAround eine Provision erhalten.' },
        },
        {
          '@type': 'Question',
          name: 'Kann mein Hotel oder Angebot auf ApeAround erscheinen?',
          acceptedAnswer: { '@type': 'Answer', text: 'Ja. Hotels, Reiseangebote, Aktivitäten und Regionen können in Inspiration-Karten, Reisevorschlägen und thematischen Übersichten auf ApeAround platziert werden.' },
        },
        {
          '@type': 'Question',
          name: 'Garantiert ApeAround Buchungen?',
          acceptedAnswer: { '@type': 'Answer', text: 'Nein. ApeAround kann die Sichtbarkeit für Angebote erhöhen und qualifizierte Nutzer weiterleiten, garantiert aber keine Buchungen oder Umsätze.' },
        },
        {
          '@type': 'Question',
          name: 'Wie schnell erhalte ich eine Rückmeldung?',
          acceptedAnswer: { '@type': 'Answer', text: 'In der Regel melden wir uns innerhalb von 2–3 Werktagen nach Eingang deiner Anfrage.' },
        },
        {
          '@type': 'Question',
          name: 'Kostet eine Anfrage etwas?',
          acceptedAnswer: { '@type': 'Answer', text: 'Nein. Das Einreichen einer Partner-Anfrage ist kostenlos und unverbindlich.' },
        },
      ],
    },
  ],
};

/* ─── static data ─────────────────────────────────────────────────────── */

const WHY_CARDS = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    title: 'Reisende früh im Entscheidungsprozess erreichen',
    text: 'Viele Nutzer wissen noch nicht genau, wohin sie reisen möchten. ApeAround setzt genau dort an — bei der Inspiration.',
    accent: '#0EA5E9',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14" /><path d="M4.93 4.93a10 10 0 0 0 0 14.14" />
      </svg>
    ),
    title: 'Passende Empfehlungen statt zufälliger Werbung',
    text: 'ApeAround verbindet Reiseideen mit Nutzerinteressen, Reisegefühl, Budget und Reisedauer.',
    accent: '#06B6D4',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
      </svg>
    ),
    title: 'Affiliate- und Empfehlungslogik integriert',
    text: 'Partnerlinks können direkt in passende Reiseinspirationen, Hotelvorschläge oder Anbieterflächen eingebunden werden.',
    accent: '#8B5CF6',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3h18v18H3z" /><path d="M3 9h18M9 21V9" />
      </svg>
    ),
    title: 'Mehr Sichtbarkeit für Angebote und Regionen',
    text: 'Ob Hotel, Region, Aktivität oder Pauschalreise — ApeAround kann Angebote in einem inspirierenden Umfeld präsentieren.',
    accent: '#F59E0B',
  },
];

const COOPERATION_OPTIONS = [
  { label: 'Affiliate-Partnerschaft', text: 'Dein Partnerlink wird über das ApeAround-Redirect-System eingebunden. Interessierte Nutzer gelangen direkt zu deinem Angebot.' },
  { label: 'Platzierung in Reiseinspirationen', text: 'Dein Hotel, deine Region oder dein Angebot kann als kuratierte Inspiration-Karte auf der /inspiration-Seite erscheinen.' },
  { label: 'Hotel- oder Angebotsvorschläge', text: 'Gezielte Anzeige in thematischen Hotelvorschlägen auf der Startseite oder in Suchergebnissen.' },
  { label: 'Regionale Reiseempfehlungen', text: 'Tourismusverbände, Städte und Regionen können als Reiseziel oder Inspiration sichtbar werden.' },
  { label: 'Destination Marketing', text: 'Wir können Reiseregionen, Nationalparks und Städte in der KI-Reiseplanung als empfehlenswerte Ziele einbinden.' },
  { label: 'Content-Kooperationen', text: 'Gemeinsame redaktionelle Beiträge, Reisetipps oder Erlebnisberichte im ApeAround-Reiseblog.' },
  { label: 'Sponsored Inspiration Cards', text: 'Gesponserte Karten mit klarer Kennzeichnung in der Inspirations-Galerie — sauber eingebettet, nicht aufdringlich.' },
  { label: 'Individuelle Kampagnen', text: 'Haben wir was vergessen? Sprich uns einfach an — wir prüfen individuelle Kooperationsideen.' },
];

const PARTNER_TYPES_TILES = [
  { emoji: '🏨', label: 'Hotels & Resorts' },
  { emoji: '🏡', label: 'Ferienwohnungen' },
  { emoji: '✈️', label: 'Reiseveranstalter' },
  { emoji: '🚗', label: 'Mietwagenanbieter' },
  { emoji: '🧗', label: 'Erlebnisanbieter' },
  { emoji: '🗺️', label: 'Tourismusregionen' },
  { emoji: '🌲', label: 'Nationalparks & Natur' },
  { emoji: '🏛️', label: 'Städte & Kulturangebote' },
  { emoji: '👨‍👩‍👧', label: 'Familienangebote' },
  { emoji: '🧘', label: 'Wellness & Romantik' },
];

const STEPS = [
  {
    n: '1',
    title: 'Kontakt aufnehmen',
    text: 'Du stellst dein Angebot, deine Region oder deine Kooperationsidee kurz vor.',
  },
  {
    n: '2',
    title: 'Passende Platzierung prüfen',
    text: 'Wir prüfen, ob und wo dein Angebot zu ApeAround passt — zum Beispiel in Inspirationen, Anbieterflächen oder Reisevorschlägen.',
  },
  {
    n: '3',
    title: 'Link oder Kampagne einbinden',
    text: 'Dein Partnerlink oder deine Angebotsseite wird sauber über das ApeAround-Redirect-System eingebunden.',
  },
  {
    n: '4',
    title: 'Besucher weiterleiten',
    text: 'Interessierte Nutzer gelangen über ApeAround zum passenden Anbieter oder Angebot.',
  },
];

const FAQ_ITEMS = [
  { q: 'Wer kann Partner von ApeAround werden?', a: 'Hotels, Ferienwohnungen, Reiseveranstalter, Mietwagenanbieter, Tourenanbieter, Tourismusregionen, Nationalparks, Städte, Freizeitparks, Erlebnisanbieter und Affiliate-Netzwerke.' },
  { q: 'Wie funktioniert eine Affiliate-Partnerschaft?', a: 'Partnerlinks werden über unser Redirect-System sauber eingebunden. Wenn Nutzer über einen Link buchen, kann ApeAround eine Provision erhalten — für Nutzer bleibt der Preis gleich.' },
  { q: 'Kann mein Hotel oder Angebot auf ApeAround erscheinen?', a: 'Ja. Hotels, Reiseangebote, Aktivitäten und Regionen können in Inspiration-Karten, Reisevorschlägen und thematischen Übersichten eingebunden werden.' },
  { q: 'Garantiert ApeAround Buchungen?', a: 'Nein. ApeAround kann die Sichtbarkeit für Angebote erhöhen und qualifizierte Nutzer weiterleiten — eine Garantie für Buchungen oder Umsätze können wir nicht geben.' },
  { q: 'Wie schnell erhalte ich eine Rückmeldung?', a: 'In der Regel melden wir uns innerhalb von 2–3 Werktagen nach Eingang deiner Anfrage.' },
  { q: 'Kostet eine Anfrage etwas?', a: 'Nein. Das Einreichen einer Partner-Anfrage ist kostenlos und unverbindlich.' },
];

/* ─── page ─────────────────────────────────────────────────────────────── */

export default function PartnerWerdenPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main>

        {/* ── Hero ──────────────────────────────────────────────────── */}
        <section style={{
          position: 'relative',
          paddingTop: 'calc(80px + 80px)',
          paddingBottom: '80px',
          background: 'linear-gradient(135deg, #0F172A 0%, #12324a 60%, #0EA5E9 160%)',
          overflow: 'hidden',
          minHeight: 'clamp(560px, 70vh, 720px)',
        }}>
          {/* Decorative glow */}
          <div aria-hidden="true" style={{
            position: 'absolute', top: '5%', right: '-5%',
            width: '540px', height: '540px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(14,165,233,0.14) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />
          <div aria-hidden="true" style={{
            position: 'absolute', bottom: '-20%', left: '-8%',
            width: '420px', height: '420px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(99,102,241,0.09) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />

          <Container>
            <div style={{ display: 'flex', alignItems: 'center', gap: '48px', flexWrap: 'wrap' }}>

              {/* Text */}
              <div style={{ flex: '1 1 340px', minWidth: 0, position: 'relative', zIndex: 2 }}>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  padding: '6px 16px', borderRadius: '40px',
                  background: 'rgba(14,165,233,0.12)', border: '1px solid rgba(14,165,233,0.30)',
                  marginBottom: '24px',
                }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                  <span style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#38BDF8', fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)' }}>
                    B2B · Kooperationen
                  </span>
                </div>

                <h1 style={{
                  fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                  fontSize: 'clamp(28px, 5vw, 52px)',
                  fontWeight: 900, lineHeight: 1.12, letterSpacing: '-0.03em',
                  color: '#FFFFFF', margin: '0 0 20px',
                  textShadow: '0 2px 16px rgba(0,0,0,0.25)',
                }}>
                  Werde Partner von{' '}
                  <span style={{
                    background: 'linear-gradient(135deg, #38BDF8 0%, #22D3EE 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}>
                    ApeAround
                  </span>
                </h1>

                <p style={{
                  fontSize: 'clamp(15px, 1.8vw, 18px)',
                  color: '#CBD5E1', lineHeight: 1.7, margin: '0 0 36px', maxWidth: '540px',
                }}>
                  Erreiche Menschen genau dann, wenn sie nach ihrer nächsten Reiseidee suchen — mit einer modernen KI-Reiseplattform, die Inspiration, Orientierung und Anbieter miteinander verbindet.
                </p>

                <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                  <a href="#partner-anfrage" style={{
                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                    padding: '14px 26px', borderRadius: '14px',
                    background: 'linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%)',
                    color: '#FFFFFF', textDecoration: 'none',
                    fontSize: '15px', fontWeight: 700,
                    boxShadow: '0 6px 24px rgba(14,165,233,0.40)',
                    fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                  }}>
                    Partnerschaft anfragen
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 5v14M5 12l7 7 7-7" />
                    </svg>
                  </a>
                  <a href="#kooperationsmoeglichkeiten" style={{
                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                    padding: '14px 26px', borderRadius: '14px',
                    background: 'rgba(255,255,255,0.08)', border: '1.5px solid rgba(255,255,255,0.18)',
                    color: '#E2E8F0', textDecoration: 'none',
                    fontSize: '15px', fontWeight: 600,
                    fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                  }}>
                    Möglichkeiten ansehen
                  </a>
                </div>
              </div>

              {/* Hero image — graceful fallback if missing */}
              <div style={{
                flex: '0 1 380px', display: 'flex', alignItems: 'center',
                justifyContent: 'center', minHeight: '280px',
                position: 'relative', zIndex: 2,
              }}>
                <PartnerHeroImage />
              </div>

            </div>
          </Container>
        </section>

        {/* ── Warum partner? ────────────────────────────────────────── */}
        <section style={{ padding: '80px 0 60px', background: '#F8FAFC' }}>
          <Container>
            <div style={{ textAlign: 'center', marginBottom: '52px' }}>
              <h2 style={{
                fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                fontSize: 'clamp(22px, 3.5vw, 36px)', fontWeight: 800,
                color: '#0F172A', margin: '0 0 14px', letterSpacing: '-0.02em',
              }}>
                Warum ApeAround für Partner spannend ist
              </h2>
              <p style={{ fontSize: 'clamp(14px, 1.6vw, 17px)', color: '#64748B', maxWidth: '560px', margin: '0 auto', lineHeight: 1.65 }}>
                Nutzer kommen zu ApeAround, weil sie Orientierung suchen — nicht weil sie bereits wissen, was sie buchen wollen.
              </p>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '20px',
            }}>
              {WHY_CARDS.map(({ icon, title, text, accent }) => (
                <div key={title} style={{
                  background: '#FFFFFF', borderRadius: '18px',
                  border: '1px solid #E2E8F0',
                  padding: '28px 24px',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                }}>
                  <div style={{
                    width: '44px', height: '44px', borderRadius: '12px',
                    background: `rgba(${accent === '#0EA5E9' ? '14,165,233' : accent === '#06B6D4' ? '6,182,212' : accent === '#8B5CF6' ? '139,92,246' : '245,158,11'}, 0.10)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: accent, marginBottom: '18px',
                  }}>
                    {icon}
                  </div>
                  <h3 style={{
                    fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                    fontSize: '16px', fontWeight: 700, color: '#0F172A',
                    margin: '0 0 10px', lineHeight: 1.35,
                  }}>{title}</h3>
                  <p style={{ fontSize: '14px', color: '#64748B', lineHeight: 1.65, margin: 0 }}>{text}</p>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* ── Kooperationsmöglichkeiten ─────────────────────────────── */}
        <section id="kooperationsmoeglichkeiten" style={{ padding: '80px 0', background: '#FFFFFF' }}>
          <Container>
            <div style={{ textAlign: 'center', marginBottom: '52px' }}>
              <h2 style={{
                fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                fontSize: 'clamp(22px, 3.5vw, 36px)', fontWeight: 800,
                color: '#0F172A', margin: '0 0 14px', letterSpacing: '-0.02em',
              }}>
                So kannst du mit ApeAround zusammenarbeiten
              </h2>
              <p style={{ fontSize: 'clamp(14px, 1.6vw, 17px)', color: '#64748B', maxWidth: '520px', margin: '0 auto', lineHeight: 1.65 }}>
                Von der einfachen Affiliate-Einbindung bis zur individuellen Kampagne — sprich uns an.
              </p>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '16px',
            }}>
              {COOPERATION_OPTIONS.map(({ label, text }) => (
                <div key={label} style={{
                  padding: '22px 20px', borderRadius: '14px',
                  border: '1.5px solid #E2E8F0', background: '#F8FAFC',
                  display: 'flex', gap: '14px',
                }}>
                  <div style={{
                    width: '28px', height: '28px', borderRadius: '8px', flexShrink: 0,
                    background: 'rgba(14,165,233,0.10)', color: '#0EA5E9',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '2px',
                  }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '14px', color: '#0F172A', marginBottom: '6px' }}>{label}</div>
                    <div style={{ fontSize: '13px', color: '#64748B', lineHeight: 1.6 }}>{text}</div>
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* ── Für wen? ──────────────────────────────────────────────── */}
        <section style={{ padding: '80px 0', background: '#F8FAFC' }}>
          <Container>
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
              <h2 style={{
                fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                fontSize: 'clamp(22px, 3.5vw, 36px)', fontWeight: 800,
                color: '#0F172A', margin: '0 0 14px', letterSpacing: '-0.02em',
              }}>
                Für welche Partner ApeAround geeignet ist
              </h2>
            </div>

            <div style={{
              display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center',
            }}>
              {PARTNER_TYPES_TILES.map(({ emoji, label }) => (
                <div key={label} style={{
                  padding: '14px 20px', borderRadius: '50px',
                  background: '#FFFFFF', border: '1.5px solid #E2E8F0',
                  fontSize: '14px', fontWeight: 600, color: '#374151',
                  display: 'flex', alignItems: 'center', gap: '8px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                }}>
                  <span style={{ fontSize: '18px' }}>{emoji}</span>
                  {label}
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* ── Wie es funktioniert ───────────────────────────────────── */}
        <section style={{ padding: '80px 0', background: '#FFFFFF' }}>
          <Container>
            <div style={{ textAlign: 'center', marginBottom: '52px' }}>
              <h2 style={{
                fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                fontSize: 'clamp(22px, 3.5vw, 36px)', fontWeight: 800,
                color: '#0F172A', margin: '0 0 14px', letterSpacing: '-0.02em',
              }}>
                So funktioniert die Zusammenarbeit
              </h2>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '24px', position: 'relative',
            }}>
              {STEPS.map(({ n, title, text }) => (
                <div key={n} style={{ textAlign: 'center', padding: '24px 16px' }}>
                  <div style={{
                    width: '52px', height: '52px', borderRadius: '50%', margin: '0 auto 20px',
                    background: 'linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                    fontSize: '18px', fontWeight: 900, color: '#FFFFFF',
                    boxShadow: '0 6px 20px rgba(14,165,233,0.30)',
                  }}>
                    {n}
                  </div>
                  <h3 style={{
                    fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                    fontSize: '16px', fontWeight: 700, color: '#0F172A',
                    margin: '0 0 10px',
                  }}>{title}</h3>
                  <p style={{ fontSize: '14px', color: '#64748B', lineHeight: 1.65, margin: 0 }}>{text}</p>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* ── Transparenz ───────────────────────────────────────────── */}
        <section style={{ padding: '60px 0', background: '#F0F9FF' }}>
          <Container size="sm">
            <div style={{
              background: '#FFFFFF', borderRadius: '20px',
              border: '1.5px solid rgba(14,165,233,0.20)',
              padding: '36px 32px', display: 'flex', gap: '20px', alignItems: 'flex-start',
            }}>
              <div style={{
                width: '44px', height: '44px', borderRadius: '12px', flexShrink: 0,
                background: 'rgba(14,165,233,0.10)', color: '#0EA5E9',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <div>
                <h2 style={{
                  fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                  fontSize: '18px', fontWeight: 800, color: '#0F172A', margin: '0 0 10px',
                }}>
                  Transparenz ist uns wichtig
                </h2>
                <p style={{ fontSize: '15px', color: '#475569', lineHeight: 1.7, margin: 0 }}>
                  ApeAround arbeitet mit externen Anbietern und Partnerlinks. Einige Links können Affiliate-Links sein.
                  Wenn Nutzer über solche Links zu einem Anbieter wechseln und dort buchen, kann ApeAround eine Provision erhalten.
                  Für Nutzer bleibt der Preis gleich. Gesponserte Inhalte werden als solche gekennzeichnet.
                </p>
              </div>
            </div>
          </Container>
        </section>

        {/* ── FAQ ───────────────────────────────────────────────────── */}
        <section style={{ padding: '80px 0', background: '#FFFFFF' }}>
          <Container size="sm">
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
              <h2 style={{
                fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                fontSize: 'clamp(22px, 3.5vw, 32px)', fontWeight: 800,
                color: '#0F172A', margin: '0 0 12px', letterSpacing: '-0.02em',
              }}>
                Häufige Fragen
              </h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {FAQ_ITEMS.map(({ q, a }) => (
                <div key={q} style={{
                  padding: '22px 24px', borderRadius: '14px',
                  border: '1.5px solid #E2E8F0', background: '#F8FAFC',
                }}>
                  <h3 style={{
                    fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                    fontSize: '15px', fontWeight: 700, color: '#0F172A', margin: '0 0 8px',
                  }}>
                    {q}
                  </h3>
                  <p style={{ fontSize: '14px', color: '#64748B', lineHeight: 1.65, margin: 0 }}>{a}</p>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* ── Kontaktformular ───────────────────────────────────────── */}
        <section id="partner-anfrage" style={{ padding: '80px 0 100px', background: '#F8FAFC' }}>
          <Container size="sm">
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '6px 16px', borderRadius: '40px', marginBottom: '16px',
                background: 'rgba(14,165,233,0.08)', border: '1px solid rgba(14,165,233,0.20)',
              }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#0EA5E9" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
                </svg>
                <span style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#0EA5E9' }}>
                  Kostenlos & unverbindlich
                </span>
              </div>
              <h2 style={{
                fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                fontSize: 'clamp(22px, 3.5vw, 34px)', fontWeight: 800,
                color: '#0F172A', margin: '0 0 14px', letterSpacing: '-0.02em',
              }}>
                Partnerschaft anfragen
              </h2>
              <p style={{ fontSize: 'clamp(14px, 1.6vw, 17px)', color: '#64748B', maxWidth: '480px', margin: '0 auto', lineHeight: 1.65 }}>
                Erzähl uns kurz, was du anbietest und wie du dir eine Zusammenarbeit vorstellst. Wir melden uns schnell zurück.
              </p>
            </div>

            <div style={{
              background: '#FFFFFF', borderRadius: '20px',
              border: '1.5px solid #E2E8F0',
              padding: 'clamp(24px, 4vw, 40px)',
              boxShadow: '0 4px 24px rgba(0,0,0,0.05)',
            }}>
              <PartnerInquiryForm />
            </div>
          </Container>
        </section>

      </main>
      <Footer />
    </>
  );
}

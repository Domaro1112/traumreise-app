import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CreatorApplicationForm from '@/components/creator/CreatorApplicationForm';

export const metadata = {
  title: 'Creator werden | ApeAround',
  description: 'Werde Teil des ApeAround Creator Clubs. Teile echte Reisetipps, gewinne Sichtbarkeit und wachse gemeinsam mit einer neuen Reiseplattform.',
  alternates: { canonical: '/creator-werden' },
  openGraph: {
    title: 'Creator werden | ApeAround',
    description: 'Werde Teil des ApeAround Creator Clubs. Teile echte Reisetipps, gewinne Sichtbarkeit und wachse gemeinsam mit einer neuen Reiseplattform.',
    type: 'website',
    url: '/creator-werden',
  },
};

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Wer kann ApeAround Creator werden?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Grundsätzlich jeder, der echte Reiseerfahrungen teilen möchte – egal ob Reiseblogger, Social-Media-Creator, UGC-Creator, Familien-Reisekonto, Camper, Hundebesitzer oder lokaler Reiseexperte. Entscheidend sind Authentizität und echter Mehrwert für Reiseinteressierte, nicht die Followerzahl.',
      },
    },
    {
      '@type': 'Question',
      name: 'Muss ich viele Follower haben?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Nein. ApeAround setzt nicht auf Reichweite als einziges Kriterium. Micro-Creator mit einer engagierten Community und echtem Reisewissen sind ebenso willkommen wie größere Accounts. Qualität und Authentizität stehen im Vordergrund.',
      },
    },
    {
      '@type': 'Question',
      name: 'Bekomme ich Geld für meine Inhalte?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Je nach Zusammenarbeit sind perspektivisch Affiliate-Beteiligungen, persönliche Empfehlungslinks oder bezahlte Content-Aufträge möglich. Am Anfang steht meistens die Sichtbarkeit und die Creator-Vorstellung auf ApeAround. Wir setzen auf langfristige Partnerschaften.',
      },
    },
    {
      '@type': 'Question',
      name: 'Was für Inhalte sucht ApeAround?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Gesucht werden echte Reisetipps, eigene Fotos oder Kurzvideos, Erfahrungsberichte zu Reisezielen, Empfehlungen für Unterkünfte, Campingplätze, Ausflüge oder Aktivitäten. Besonders willkommen sind Inhalte für Familien, Alleinerziehende, Paare, Camper, Hundebesitzer oder Budgetreisende.',
      },
    },
    {
      '@type': 'Question',
      name: 'Wie läuft die Bewerbung ab?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Du füllst das Bewerbungsformular auf dieser Seite aus. Wir prüfen dein Profil und melden uns, wenn dein Themenfeld zu ApeAround passt. Im nächsten Schritt besprechen wir die mögliche Zusammenarbeit individuell.',
      },
    },
    {
      '@type': 'Question',
      name: 'Gibt es Affiliate-Links?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Ja, perspektivisch sind persönliche Empfehlungslinks und Affiliate-Beteiligungen möglich. Alle Affiliate-Links und Kooperationen werden entsprechend den gesetzlichen Vorgaben transparent gekennzeichnet. ApeAround setzt auf fairen und transparenten Umgang mit Werbung.',
      },
    },
  ],
};

// ── Inline SVG Icons ──────────────────────────────────────────────────────────
function Icon({ d, size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}

const ICONS = {
  fileText:    'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8',
  users:       'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75 M9 7m-4 0a4 4 0 1 0 8 0 4 4 0 1 0-8 0',
  compass:     'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20 M16.24 7.76l-2.12 6.36-6.36 2.12 2.12-6.36z',
  heart:       'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z',
  camera:      'M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z M12 17m-4 0a4 4 0 1 0 8 0 4 4 0 1 0-8 0',
  map:         'M1 6v16l7-4 8 4 7-4V2l-7 4-8-4-7 4z M8 2v16 M16 6v16',
  mountain:    'M8 3l4 8 5-5 5 15H2L8 3z',
  star:        'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
  eye:         'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 12m-3 0a3 3 0 1 0 6 0 3 3 0 1 0-6 0',
  link:        'M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71 M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71',
  trending:    'M23 6l-9.5 9.5-5-5L1 18 M17 6h6v6',
  briefcase:   'M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2',
  globe:       'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20 M2 12h20 M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z',
  handshake:   'M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 7.65l.77.78L12 21l7.65-8.19.77-.78a5.4 5.4 0 0 0 0-7.65',
  shield:      'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
  check:       'M20 6L9 17l-5-5',
  sparkles:    'M12 3L9.5 8.5H4l4.5 3.5-1.5 5.5L12 14l5 3.5-1.5-5.5L20 8.5h-5.5z',
  arrowDown:   'M12 5v14 M5 12l7 7 7-7',
};

// ── Sub-components ─────────────────────────────────────────────────────────────
function SectionLabel({ text, color = '#0EA5E9' }) {
  return (
    <p style={{
      fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em',
      textTransform: 'uppercase', color, margin: '0 0 8px',
      fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
    }}>
      {text}
    </p>
  );
}

function SectionTitle({ children, center = false }) {
  return (
    <h2 style={{
      fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 800, color: '#0F172A',
      margin: '0 0 16px', letterSpacing: '-0.02em',
      fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
      textAlign: center ? 'center' : undefined,
    }}>
      {children}
    </h2>
  );
}

function SectionSubtitle({ children, center = false }) {
  return (
    <p style={{
      fontSize: 'clamp(15px, 1.5vw, 17px)', color: '#475569', lineHeight: 1.7,
      margin: '0 0 40px', maxWidth: center ? '620px' : undefined,
      marginLeft: center ? 'auto' : undefined, marginRight: center ? 'auto' : undefined,
      textAlign: center ? 'center' : undefined,
    }}>
      {children}
    </p>
  );
}

// ── Static data ─────────────────────────────────────────────────────────────
const CREATOR_TYPES = [
  {
    icon: 'fileText', label: 'Reiseblogger',
    desc: 'Du schreibst Erfahrungsberichte, Reisetipps oder Reiseführer und teilst dein Wissen mit anderen Reiseinteressierten.',
    color: '#0EA5E9', bg: 'rgba(14,165,233,0.06)',
  },
  {
    icon: 'users', label: 'Familienreise-Creator',
    desc: 'Du reist mit Kindern und weißt, worauf es bei familienfreundlichen Unterkünften, Reisezielen und Aktivitäten ankommt.',
    color: '#7C3AED', bg: 'rgba(124,58,237,0.06)',
  },
  {
    icon: 'compass', label: 'Camper & Vanlife',
    desc: 'Du lebst oder reist im Van oder Wohnmobil und teilst Routen, Stellplätze und praktische Tipps für die Straße.',
    color: '#D97706', bg: 'rgba(217,119,6,0.06)',
  },
  {
    icon: 'heart', label: 'Urlaub mit Hund',
    desc: 'Du reist mit deinem Hund und kennst die besten hundefreundlichen Unterkünfte, Strände und Wanderrouten.',
    color: '#EC4899', bg: 'rgba(236,72,153,0.06)',
  },
  {
    icon: 'star', label: 'Paare & Kurztrip-Fans',
    desc: 'Du planst Städtetrips, Wochenendausflüge oder Romantikurlaube und teilst Geheimtipps für zwei.',
    color: '#F59E0B', bg: 'rgba(245,158,11,0.06)',
  },
  {
    icon: 'camera', label: 'UGC Creator',
    desc: 'Du produzierst authentische Fotos oder Videos von Reiseerlebnissen – für Marken, Plattformen oder eigene Kanäle.',
    color: '#06B6D4', bg: 'rgba(6,182,212,0.06)',
  },
  {
    icon: 'map', label: 'Lokale Reiseexperten',
    desc: 'Du kennst deine Region oder ein bestimmtes Reiseziel besonders gut und teilst echte Insider-Tipps aus erster Hand.',
    color: '#059669', bg: 'rgba(5,150,105,0.06)',
  },
  {
    icon: 'mountain', label: 'Outdoor & Aktivurlaub',
    desc: 'Wandern, Klettern, Surfen oder Radreisen – du teilst Erfahrungen aus dem Aktivurlaub und inspierst andere.',
    color: '#10B981', bg: 'rgba(16,185,129,0.06)',
  },
];

const BENEFITS = [
  { icon: 'sparkles',   label: 'Eigene Creator-Vorstellung', desc: 'Dein Profil, dein Thema und deine Geschichte auf ApeAround präsentiert.' },
  { icon: 'link',       label: 'Verlinkung zu deinem Kanal', desc: 'Direkte Links zu deinem Blog, Instagram, TikTok oder YouTube-Kanal.' },
  { icon: 'eye',        label: 'Sichtbarkeit im richtigen Kontext', desc: 'Deine Empfehlungen erscheinen bei passenden Reisezielen und Themen.' },
  { icon: 'globe',      label: 'Persönliche Empfehlungslinks', desc: 'Eigene Links, mit denen Nutzer deine Tipps direkt buchen können.' },
  { icon: 'trending',   label: 'Perspektivische Affiliate-Beteiligung', desc: 'Beteiligung an Buchungen über deine Empfehlungslinks, sobald das Modell steht.' },
  { icon: 'briefcase',  label: 'Mögliche bezahlte Content-Aufträge', desc: 'Bei passender Zusammenarbeit sind vergütete Inhalte und Kampagnen möglich.' },
  { icon: 'users',      label: 'Teil einer wachsenden Plattform', desc: 'Wachse gemeinsam mit ApeAround und profitiere von einer steigenden Nutzerbasis.' },
  { icon: 'handshake',  label: 'Langfristige Partnerschaften', desc: 'Kein Einmal-Deal. Wir suchen Creator, mit denen wir nachhaltig zusammenarbeiten.' },
];

const CONTENT_TYPES = [
  'Echte Reisetipps aus eigener Erfahrung',
  'Eigene Fotos oder Kurzvideos von Reisen',
  'Erfahrungsberichte zu Reisezielen, Unterkünften oder Aktivitäten',
  'Empfehlungen für Hotels, Campingplätze, Ferienwohnungen oder Ferienparks',
  'Tipps für Ausflüge, Stadtführungen, lokale Restaurants oder Geheimtipps',
  'Inhalte speziell für Familien, Alleinerziehende, Paare oder Hundebesitzer',
  'Camper-Tipps, Vanlife-Erfahrungen oder Roadtrip-Routen',
  'Ehrliche Einschätzungen statt generischer Werbetexte',
];

const STEPS = [
  {
    num: '01', title: 'Bewerbung ausfüllen',
    desc: 'Fülle das kurze Formular auf dieser Seite aus. Name, E-Mail, dein Profil-Link und eine kurze Beschreibung genügen für den Anfang.',
  },
  {
    num: '02', title: 'Prüfung durch ApeAround',
    desc: 'Wir schauen uns dein Profil, deine Inhalte und deinen Themenbereich an und prüfen, ob die Zusammenarbeit sinnvoll ist.',
  },
  {
    num: '03', title: 'Creator-Vorstellung oder erste Idee',
    desc: 'Bei einem passenden Profil erhältst du eine Creator-Vorstellung auf ApeAround oder wir besprechen eine erste gemeinsame Content-Idee.',
  },
  {
    num: '04', title: 'Wachsen gemeinsam',
    desc: 'Bei passender Zusammenarbeit sind Empfehlungslinks, Affiliate-Beteiligungen oder bezahlte Aufträge der nächste Schritt.',
  },
];

const TRANSPARENCY = [
  { icon: 'check', text: 'Keine Fake-Bewertungen. Nur echte, eigene Erfahrungen.' },
  { icon: 'check', text: 'Werbliche Inhalte und Affiliate-Links werden klar und transparent gekennzeichnet.' },
  { icon: 'check', text: 'Keine übertriebenen Versprechen. Faire und realistische Erwartungen von Anfang an.' },
  { icon: 'check', text: 'ApeAround setzt auf Vertrauen, Qualität und nachhaltige Partnerschaften.' },
];

const FAQ = [
  { q: 'Wer kann Creator werden?', a: 'Alle, die echte Reiseerfahrungen teilen möchten – unabhängig von der Followerzahl. Entscheidend sind Authentizität und Mehrwert.' },
  { q: 'Brauche ich viele Follower?', a: 'Nein. Micro-Creator mit engagierter Community sind genauso willkommen wie größere Accounts.' },
  { q: 'Bekomme ich eine Vergütung?', a: 'Perspektivisch ja: Affiliate-Links, Empfehlungslinks und bezahlte Content-Aufträge sind möglich. Am Anfang steht die Sichtbarkeit.' },
  { q: 'Welche Inhalte werden gesucht?', a: 'Echte Reisetipps, Fotos, Videos, Erfahrungsberichte. Besonders gefragt: Familien, Camper, Hundebesitzer, Alleinerziehende.' },
  { q: 'Wie lange dauert die Prüfung?', a: 'Wir melden uns, wenn dein Profil passt. Aufgrund der Bewerbungen kann es einige Tage dauern.' },
  { q: 'Gibt es Affiliate-Links?', a: 'Ja, perspektivisch. Alle Links und Kooperationen werden nach den gesetzlichen Anforderungen transparent gekennzeichnet.' },
];

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function CreatorWerdenPage() {
  const container = {
    maxWidth: '1100px', margin: '0 auto',
    padding: '0 clamp(16px, 4vw, 32px)',
  };

  const section = (bg = '#FFFFFF', py = 'clamp(60px, 8vw, 100px)') => ({
    background: bg, padding: `${py} 0`,
  });

  return (
    <>
      <Header />
      <main style={{ paddingTop: '72px' }}>

        {/* ── HERO ──────────────────────────────────────────────────────────── */}
        <section style={{
          background: 'linear-gradient(135deg, #0C1A2E 0%, #0D2744 50%, #0B3354 100%)',
          padding: 'clamp(80px, 10vw, 130px) 0 clamp(70px, 9vw, 110px)',
          position: 'relative', overflow: 'hidden',
        }}>
          {/* Decorative circles */}
          <div style={{
            position: 'absolute', top: '-100px', right: '-80px',
            width: '500px', height: '500px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(14,165,233,0.12) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute', bottom: '-80px', left: '-60px',
            width: '380px', height: '380px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(6,182,212,0.08) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />

          <div style={{ ...container, position: 'relative' }}>
            <div style={{ maxWidth: '680px' }}>
              {/* Label */}
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '6px 14px', borderRadius: '20px',
                background: 'rgba(14,165,233,0.14)', border: '1px solid rgba(14,165,233,0.25)',
                marginBottom: '28px',
              }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#38BDF8', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  ApeAround Creator Club
                </span>
              </div>

              <h1 style={{
                fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 900, color: '#F8FAFC',
                margin: '0 0 20px', lineHeight: 1.1, letterSpacing: '-0.03em',
                fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
              }}>
                Werde ApeAround Creator
              </h1>

              <p style={{
                fontSize: 'clamp(17px, 2vw, 20px)', color: '#94A3B8',
                margin: '0 0 16px', lineHeight: 1.6, fontWeight: 500,
              }}>
                Teile deine Reiseideen, inspiriere andere Urlauber und wachse gemeinsam mit einer neuen Reiseplattform.
              </p>

              <p style={{
                fontSize: 'clamp(14px, 1.5vw, 16px)', color: '#64748B',
                margin: '0 0 40px', lineHeight: 1.7,
              }}>
                Ob Familienurlaub, Camper-Abenteuer, Urlaub mit Hund, Städtetrips oder echte Geheimtipps: ApeAround sucht Menschen, die Reisen lieben und ihre Erfahrungen mit anderen teilen möchten.
              </p>

              <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                <a
                  href="#creator-form"
                  style={{
                    display: 'inline-block', padding: '15px 32px', borderRadius: '14px',
                    background: 'linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%)',
                    color: '#FFFFFF', fontWeight: 700, fontSize: '15px',
                    textDecoration: 'none',
                    fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                    boxShadow: '0 4px 24px rgba(14,165,233,0.40)',
                  }}
                >
                  Jetzt als Creator bewerben
                </a>
                <a
                  href="#fuer-wen"
                  style={{
                    display: 'inline-block', padding: '15px 32px', borderRadius: '14px',
                    background: 'rgba(255,255,255,0.07)', border: '1.5px solid rgba(255,255,255,0.14)',
                    color: '#CBD5E1', fontWeight: 600, fontSize: '15px',
                    textDecoration: 'none',
                  }}
                >
                  Mehr erfahren
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ── FÜR WEN ─────────────────────────────────────────────────────── */}
        <section id="fuer-wen" style={section('#F8FAFC')}>
          <div style={container}>
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
              <SectionLabel text="Der Creator Club" />
              <SectionTitle center>Für wen ist der Creator Club?</SectionTitle>
              <SectionSubtitle center>
                ApeAround sucht Creator aus den unterschiedlichsten Reise-Bereichen. Entscheidend ist nicht die Reichweite, sondern die Authentizität und der echte Mehrwert für Reiseinteressierte.
              </SectionSubtitle>
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
              gap: '16px',
            }}>
              {CREATOR_TYPES.map(ct => (
                <div key={ct.label} style={{
                  background: ct.bg,
                  border: `1.5px solid ${ct.color}22`,
                  borderRadius: '16px', padding: '22px',
                }}>
                  <div style={{
                    width: '44px', height: '44px', borderRadius: '12px',
                    background: `${ct.color}18`, color: ct.color,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: '14px',
                  }}>
                    <Icon d={ICONS[ct.icon]} size={20} />
                  </div>
                  <h3 style={{
                    fontSize: '15px', fontWeight: 700, color: '#0F172A',
                    margin: '0 0 8px',
                    fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                  }}>
                    {ct.label}
                  </h3>
                  <p style={{ fontSize: '13px', color: '#475569', lineHeight: 1.6, margin: 0 }}>
                    {ct.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── WAS DU BEKOMMST ──────────────────────────────────────────────── */}
        <section style={section('#FFFFFF')}>
          <div style={container}>
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
              <SectionLabel text="Deine Vorteile" />
              <SectionTitle center>Was du bekommst</SectionTitle>
              <SectionSubtitle center>
                ApeAround bietet keine leeren Versprechen. Hier sind die konkreten Möglichkeiten, die mit einer Creator-Partnerschaft verbunden sein können.
              </SectionSubtitle>
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
              gap: '14px',
            }}>
              {BENEFITS.map(b => (
                <div key={b.label} style={{
                  background: '#F8FAFC', border: '1.5px solid #E2E8F0',
                  borderRadius: '16px', padding: '22px',
                }}>
                  <div style={{
                    width: '40px', height: '40px', borderRadius: '10px',
                    background: 'rgba(14,165,233,0.10)', color: '#0EA5E9',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: '12px',
                  }}>
                    <Icon d={ICONS[b.icon]} size={18} />
                  </div>
                  <h3 style={{
                    fontSize: '14px', fontWeight: 700, color: '#0F172A', margin: '0 0 6px',
                    fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                  }}>
                    {b.label}
                  </h3>
                  <p style={{ fontSize: '13px', color: '#64748B', lineHeight: 1.55, margin: 0 }}>
                    {b.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── WAS DU EINBRINGEN KANNST ──────────────────────────────────────── */}
        <section style={section('#F0F9FF')}>
          <div style={container}>
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '48px', alignItems: 'center',
            }}>
              <div>
                <SectionLabel text="Dein Beitrag" />
                <SectionTitle>Was du einbringen kannst</SectionTitle>
                <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.7, margin: '0 0 28px' }}>
                  ApeAround sucht keine perfekt inszenierten Hochglanz-Inhalte, sondern echte Erfahrungen. Wenn du reist, schreibst, fotografierst oder filmst – dann bist du bei uns richtig.
                </p>
                <a
                  href="#creator-form"
                  style={{
                    display: 'inline-block', padding: '13px 28px', borderRadius: '12px',
                    background: 'linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%)',
                    color: '#FFFFFF', fontWeight: 700, fontSize: '14px',
                    textDecoration: 'none',
                    fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                    boxShadow: '0 4px 16px rgba(14,165,233,0.30)',
                  }}
                >
                  Jetzt bewerben
                </a>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {CONTENT_TYPES.map(item => (
                  <div key={item} style={{
                    display: 'flex', alignItems: 'flex-start', gap: '12px',
                    padding: '14px 18px', background: '#FFFFFF',
                    borderRadius: '12px', border: '1.5px solid #E2E8F0',
                  }}>
                    <div style={{
                      width: '22px', height: '22px', borderRadius: '50%',
                      background: 'rgba(14,165,233,0.12)', color: '#0EA5E9',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0, marginTop: '1px',
                    }}>
                      <Icon d={ICONS.check} size={12} />
                    </div>
                    <span style={{ fontSize: '14px', color: '#374151', lineHeight: 1.5 }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── SO FUNKTIONIERT ES ────────────────────────────────────────────── */}
        <section style={section('#FFFFFF')}>
          <div style={container}>
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
              <SectionLabel text="Der Ablauf" />
              <SectionTitle center>So funktioniert es</SectionTitle>
              <SectionSubtitle center>
                Der Weg zur Creator-Partnerschaft ist unkompliziert und transparent.
              </SectionSubtitle>
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '16px',
            }}>
              {STEPS.map((step, i) => (
                <div key={step.num} style={{
                  background: i % 2 === 0 ? '#F8FAFC' : 'rgba(14,165,233,0.04)',
                  border: '1.5px solid #E2E8F0',
                  borderRadius: '18px', padding: '28px 22px',
                  position: 'relative',
                }}>
                  <div style={{
                    fontSize: '32px', fontWeight: 900, color: '#E2E8F0',
                    fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                    marginBottom: '12px', lineHeight: 1,
                  }}>
                    {step.num}
                  </div>
                  <h3 style={{
                    fontSize: '16px', fontWeight: 700, color: '#0F172A', margin: '0 0 10px',
                    fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                  }}>
                    {step.title}
                  </h3>
                  <p style={{ fontSize: '14px', color: '#64748B', lineHeight: 1.65, margin: 0 }}>
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── TRANSPARENZ ──────────────────────────────────────────────────── */}
        <section style={section('#0F172A')}>
          <div style={container}>
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '48px', alignItems: 'center',
            }}>
              <div>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  padding: '5px 12px', borderRadius: '20px',
                  background: 'rgba(14,165,233,0.14)', marginBottom: '20px',
                }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#38BDF8', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                    Wichtig
                  </span>
                </div>
                <h2 style={{
                  fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 800, color: '#F8FAFC',
                  margin: '0 0 16px', letterSpacing: '-0.02em',
                  fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                }}>
                  Ehrlichkeit und Transparenz kommen zuerst
                </h2>
                <p style={{ fontSize: '16px', color: '#94A3B8', lineHeight: 1.7, margin: 0 }}>
                  ApeAround steht für authentische Reiseinspiration. Das gilt für Nutzer genauso wie für Creator-Partnerschaften. Wir setzen auf klare Spielregeln und echtes Vertrauen.
                </p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {TRANSPARENCY.map(item => (
                  <div key={item.text} style={{
                    display: 'flex', alignItems: 'flex-start', gap: '14px',
                    padding: '16px 20px', background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px',
                  }}>
                    <div style={{
                      width: '24px', height: '24px', borderRadius: '50%',
                      background: 'rgba(16,185,129,0.18)', color: '#10B981',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <Icon d={ICONS.check} size={13} />
                    </div>
                    <span style={{ fontSize: '14px', color: '#CBD5E1', lineHeight: 1.6 }}>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── BEWERBUNGSFORMULAR ────────────────────────────────────────────── */}
        <section id="creator-form" style={section('#F8FAFC')}>
          <div style={container}>
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '60px', alignItems: 'start',
            }}>
              {/* Left: Info */}
              <div style={{ paddingTop: '8px' }}>
                <SectionLabel text="Bewerbung" />
                <SectionTitle>Jetzt als Creator bewerben</SectionTitle>
                <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.7, margin: '0 0 28px' }}>
                  Fülle das Formular aus und beschreibe kurz, wer du bist und was du machst. Wir melden uns, wenn dein Profil zu ApeAround passt.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {[
                    { icon: 'check', text: 'Kostenlos und unverbindlich bewerben' },
                    { icon: 'check', text: 'Keine Mindest-Followeranzahl erforderlich' },
                    { icon: 'check', text: 'Individuelle Absprache zur Zusammenarbeit' },
                    { icon: 'check', text: 'Faire und transparente Konditionen' },
                  ].map(item => (
                    <div key={item.text} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '22px', height: '22px', borderRadius: '50%',
                        background: 'rgba(14,165,233,0.12)', color: '#0EA5E9',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                      }}>
                        <Icon d={ICONS.check} size={11} />
                      </div>
                      <span style={{ fontSize: '14px', color: '#374151' }}>{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Form */}
              <div style={{
                background: '#FFFFFF', border: '1.5px solid #E2E8F0',
                borderRadius: '20px', padding: 'clamp(24px, 4vw, 36px)',
              }}>
                <CreatorApplicationForm />
              </div>
            </div>
          </div>
        </section>

        {/* ── FAQ ───────────────────────────────────────────────────────────── */}
        <section style={section('#FFFFFF')}>
          <div style={{ ...container, maxWidth: '780px' }}>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <SectionLabel text="FAQ" />
              <SectionTitle center>Häufige Fragen</SectionTitle>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {FAQ.map(item => (
                <div key={item.q} style={{
                  background: '#F8FAFC', border: '1.5px solid #E2E8F0',
                  borderRadius: '14px', padding: '20px 24px',
                }}>
                  <h3 style={{
                    fontSize: '15px', fontWeight: 700, color: '#0F172A', margin: '0 0 8px',
                    fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                  }}>
                    {item.q}
                  </h3>
                  <p style={{ fontSize: '14px', color: '#64748B', lineHeight: 1.65, margin: 0 }}>
                    {item.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── BOTTOM CTA ────────────────────────────────────────────────────── */}
        <section style={{
          background: 'linear-gradient(135deg, #0EA5E9 0%, #0284C7 100%)',
          padding: 'clamp(60px, 8vw, 90px) 0',
          textAlign: 'center',
        }}>
          <div style={container}>
            <h2 style={{
              fontSize: 'clamp(22px, 3vw, 34px)', fontWeight: 800, color: '#FFFFFF',
              margin: '0 0 16px', letterSpacing: '-0.02em',
              fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
            }}>
              Bereit, Teil des Creator Clubs zu werden?
            </h2>
            <p style={{ fontSize: '17px', color: 'rgba(255,255,255,0.80)', margin: '0 0 32px', lineHeight: 1.6 }}>
              Bewirb dich jetzt – kostenlos und unverbindlich.
            </p>
            <a
              href="#creator-form"
              style={{
                display: 'inline-block', padding: '16px 40px', borderRadius: '14px',
                background: '#FFFFFF', color: '#0284C7',
                fontWeight: 800, fontSize: '16px', textDecoration: 'none',
                fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
              }}
            >
              Jetzt als Creator bewerben
            </a>
          </div>
        </section>

      </main>
      <Footer />

      {/* FAQ JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
    </>
  );
}

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Container from '@/components/layout/Container';
import AlleinerziehendHeroImage from '@/components/urlaub-alleinerziehende/AlleinerziehendHeroImage';

export const metadata = {
  title: 'Urlaub für Alleinerziehende mit Kind | ApeAround',
  description:
    'Plane stressarme Reiseideen für Alleinerziehende mit Kind: familienfreundliche Unterkünfte, kurze Wege, faire Budgets und passende Urlaubsziele mit ApeAround.',
  openGraph: {
    title: 'Urlaub für Alleinerziehende mit Kind | ApeAround',
    description:
      'Plane stressarme Reiseideen für Alleinerziehende mit Kind: familienfreundliche Unterkünfte, kurze Wege, faire Budgets und passende Urlaubsziele mit ApeAround.',
    url: 'https://apearound.de/urlaub-fuer-alleinerziehende',
    siteName: 'ApeAround',
    type: 'website',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': 'https://apearound.de/urlaub-fuer-alleinerziehende',
      url: 'https://apearound.de/urlaub-fuer-alleinerziehende',
      name: 'Urlaub für Alleinerziehende mit Kind | ApeAround',
      description:
        'Stressarme Reiseideen für Alleinerziehende mit Kind. Familienfreundliche Unterkünfte, kurze Wege, faire Budgets und passende Urlaubsziele.',
      isPartOf: { '@id': 'https://apearound.de/#organization' },
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Welcher Urlaub eignet sich für Alleinerziehende mit Kind?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Besonders geeignet sind Ferienparks mit Kinderangeboten, Bauernhofurlaub, Urlaub an Nord- oder Ostsee sowie All-Inclusive-Resorts mit Kinderbetreuung. Diese Reisearten punkten mit kurzen Wegen, planbarer Struktur und einer sicheren Umgebung – entscheidende Faktoren, wenn man als einzige erwachsene Person die Verantwortung trägt.',
          },
        },
        {
          '@type': 'Question',
          name: 'Ist All-Inclusive für Alleinerziehende sinnvoll?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'All-Inclusive kann für Alleinerziehende sehr praktisch sein: Verpflegung, Unterkunft und Kinderanimation sind gebündelt, das Budget ist kalkulierbar und es gibt keine tägliche Entscheidung über Restaurants oder Ausflüge. Wichtig ist, ein Resort zu wählen, das echte Kinderbetreuung anbietet – dann hat auch der Elternteil gelegentlich Erholung.',
          },
        },
        {
          '@type': 'Question',
          name: 'Welche Reiseziele sind für Alleinerziehende besonders stressarm?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Stressarm bedeutet: kurze oder einfache Anreise, bekannte Sprache oder touristisch gut erschlossene Ziele, sichere Umgebung und keine komplizierten Transfers. Beliebte stressarme Reiseziele sind die deutsche Nord- und Ostseeküste, Österreich, Südtirol, die Niederlande und Mallorca. Städtetrips mit direkter Bahnanbindung eignen sich gut für Familien mit Kindern ab ca. 5 Jahren.',
          },
        },
        {
          '@type': 'Question',
          name: 'Wie kann man als Alleinerziehende/r günstig Urlaub machen?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Günstige Optionen sind Camping mit festem Stellplatz, Ferienwohnungen außerhalb der Hauptsaison, Bauernhofurlaub und Ferienparks mit Frühbucherrabatten. Viele Anbieter bieten Einzelkind-Zuschläge, die oft verhandelbar sind. Außerdem lohnt sich die Prüfung, ob staatliche Unterstützungsleistungen für Alleinerziehende genutzt werden können, etwa über Ferienwerk oder ähnliche Organisationen.',
          },
        },
        {
          '@type': 'Question',
          name: 'Sind Ferienparks für Alleinerziehende geeignet?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Ferienparks sind für Alleinerziehende oft sehr gut geeignet: alles liegt nah beieinander, es gibt gesicherte Spielbereiche, Kinderanimation, Restaurants und Pools auf dem Gelände. Man kann abends die Kinder schlafen legen und ist trotzdem in einer sicheren Umgebung. Besonders Centerparcs, KNAUS-Campingparks und vergleichbare Anlagen sind auf Familien ausgerichtet.',
          },
        },
        {
          '@type': 'Question',
          name: 'Worauf sollte man bei der Unterkunft achten?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Als Alleinerziehende/r sollte die Unterkunft vor allem praktisch sein: kein Durchgangszimmer für das Kind, eine Küche oder Küchenzeile für spontane Mahlzeiten, Lage in Gehdistanz zu Aktivitäten, und nach Möglichkeit kein aufwändiger Check-in-Prozess. Ferienwohnungen bieten meist mehr Flexibilität als Hotelzimmer. Bewertungen anderer Familien geben oft wertvolle Hinweise.',
          },
        },
      ],
    },
  ],
};

const PROBLEM_POINTS = [
  { label: 'Knappes Budget', text: 'Ein Einkommen muss Unterkunft, Anreise und Aktivitäten für zwei oder mehr Personen abdecken.' },
  { label: 'Hoher Organisationsaufwand', text: 'Packen, buchen, planen – alles liegt an einer einzigen Person.' },
  { label: 'Sicherheitsbedürfnis', text: 'Fremde Orte mit Kind allein zu erkunden, erfordert mehr Vertrauen ins Ziel und die Umgebung.' },
  { label: 'Passende Unterkunft', text: 'Nicht jedes Hotel oder Apartment ist auf eine erwachsene Person mit Kind ausgelegt.' },
  { label: 'Kurze Wege', text: 'Lange Transfers und komplizierte Verbindungen kosten Energie, die fehlt.' },
  { label: 'Beschäftigung für Kinder', text: 'Das Kind soll Spaß haben – das schränkt die Zielauswahl ein und erhöht den Planungsdruck.' },
  { label: 'Kaum Erholung', text: 'Wenn keine zweite erwachsene Person da ist, die mal übernimmt, fehlt echte Auszeit.' },
];

const BENEFIT_POINTS = [
  { label: 'Einfache Anreise', text: 'Kurze Flug- oder Bahnverbindungen, keine Umsteigestress, direkte Transfers.' },
  { label: 'Familienfreundliche Unterkünfte', text: 'Apartements oder Resorts mit Küche, Schlafbereich für das Kind und kindsicherer Ausstattung.' },
  { label: 'Kindgerechte Aktivitäten', text: 'Ausflüge und Aktivitäten, die für das Alter des Kindes passen.' },
  { label: 'Sichere Umgebung', text: 'Gut erschlossene, touristisch vertraute Ziele mit überschaubarer Infrastruktur.' },
  { label: 'Faire Budgeteinschätzung', text: 'Realistische Kosten statt versteckter Zusatzpreise – damit das Budget verlässlich bleibt.' },
  { label: 'Kurze Wege vor Ort', text: 'Alles Wesentliche in Gehdistanz: Strand, Supermarkt, Spielplatz, Restaurant.' },
  { label: 'Stressarme Planung', text: 'Übersichtliche Reiseideen ohne zu viele Einzelentscheidungen.' },
];

const TRAVEL_TYPES = [
  {
    title: 'Ferienpark mit Kind',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
    text: 'Alles auf einem Gelände: Pool, Kinderanimation, Restaurant und gesicherte Spielflächen. Ferienparks nehmen Alleinerziehenden viel Planungsarbeit ab, weil Unterhaltung und Verpflegung direkt vor der Tür liegen.',
  },
  {
    title: 'Urlaub an der Nordsee oder Ostsee',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/>
        <path d="M2 12c.6.5 1.2 1 2.5 1C7 13 7 11 9.5 11c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/>
        <path d="M2 18c.6.5 1.2 1 2.5 1C7 19 7 17 9.5 17c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/>
      </svg>
    ),
    text: 'Kein langer Flug, keine Sprachbarriere, vertraute Lebensmittel. Der Strand bietet stundenlange natürliche Beschäftigung für Kinder. Die Nord- und Ostseeküste sind für Alleinerziehende besonders stressarme Destinationen.',
  },
  {
    title: 'Bauernhofurlaub',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a10 10 0 0 1 10 10H2A10 10 0 0 1 12 2z"/><path d="M12 12v10"/><path d="M12 12l-4-4"/><path d="M12 12l4-4"/>
      </svg>
    ),
    text: 'Tiere füttern, draußen spielen, Natur entdecken – Bauernhofurlaub ist für Kinder erlebnisreich und für Elternteile oft entspannter als Stadttrips. Viele Höfe bieten Ferienwohnungen an, die für eine Person mit Kind ideal zugeschnitten sind.',
  },
  {
    title: 'All-Inclusive mit Kinderbetreuung',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/>
      </svg>
    ),
    text: 'Kein tägliches Budget-Kopfzerbrechen, kein Restaurant-Suchen, kalkulierbare Gesamtkosten. Resorts mit Kinderclub geben dem Elternteil tatsächlich etwas Erholung – eine Seltenheit im Urlaub allein mit Kind.',
  },
  {
    title: 'Campingurlaub mit Kind',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 17l7.5-13L18 17"/><path d="M1 17h22"/>
      </svg>
    ),
    text: 'Camping ist eine der günstigsten Reiseformen und bietet Kindern viel Freiheit. Feste Stellplätze auf Campingplätzen mit Sanitäranlagen und Spielbereichen sind besonders für Alleinerziehende empfehlenswert – flexibler als ein Hotel, sicherer als Wildcampen.',
  },
  {
    title: 'Städtetrip mit kurzer Anreise',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
      </svg>
    ),
    text: 'Für Kinder ab ca. 5 Jahren eignen sich kurze Städtetrips mit direkter Bahn- oder Busverbindung. Hamburg, Berlin, Wien, Prag – viele Städte haben kinderfreundliche Museen, Parks und kurze Wege. Gut planbar, kein langer Anreisetag.',
  },
];

const FAQ_ITEMS = [
  {
    q: 'Welcher Urlaub eignet sich für Alleinerziehende mit Kind?',
    a: 'Besonders geeignet sind Ferienparks mit Kinderangeboten, Bauernhofurlaub, Urlaub an Nord- oder Ostsee sowie All-Inclusive-Resorts mit Kinderbetreuung. Diese Reisearten punkten mit kurzen Wegen, planbarer Struktur und einer sicheren Umgebung – entscheidende Faktoren, wenn man als einzige erwachsene Person die Verantwortung trägt.',
  },
  {
    q: 'Ist All-Inclusive für Alleinerziehende sinnvoll?',
    a: 'All-Inclusive kann für Alleinerziehende sehr praktisch sein: Verpflegung, Unterkunft und Kinderanimation sind gebündelt, das Budget ist kalkulierbar und es gibt keine tägliche Entscheidung über Restaurants oder Ausflüge. Wichtig ist, ein Resort zu wählen, das echte Kinderbetreuung anbietet – dann hat auch der Elternteil gelegentlich Erholung.',
  },
  {
    q: 'Welche Reiseziele sind für Alleinerziehende besonders stressarm?',
    a: 'Stressarm bedeutet: kurze oder einfache Anreise, bekannte Sprache oder touristisch gut erschlossene Ziele, sichere Umgebung und keine komplizierten Transfers. Beliebte stressarme Reiseziele sind die deutsche Nord- und Ostseeküste, Österreich, Südtirol, die Niederlande und Mallorca. Städtetrips mit direkter Bahnanbindung eignen sich gut für Familien mit Kindern ab ca. 5 Jahren.',
  },
  {
    q: 'Wie kann man als Alleinerziehende/r günstig Urlaub machen?',
    a: 'Günstige Optionen sind Camping mit festem Stellplatz, Ferienwohnungen außerhalb der Hauptsaison, Bauernhofurlaub und Ferienparks mit Frühbucherrabatten. Viele Anbieter bieten Einzelkind-Zuschläge, die oft verhandelbar sind. Außerdem lohnt sich die Prüfung, ob staatliche Unterstützungsleistungen für Alleinerziehende genutzt werden können, etwa über Ferienwerk oder ähnliche Organisationen.',
  },
  {
    q: 'Sind Ferienparks für Alleinerziehende geeignet?',
    a: 'Ferienparks sind für Alleinerziehende oft sehr gut geeignet: alles liegt nah beieinander, es gibt gesicherte Spielbereiche, Kinderanimation, Restaurants und Pools auf dem Gelände. Man kann abends die Kinder schlafen legen und ist trotzdem in einer sicheren Umgebung. Besonders Centerparcs, KNAUS-Campingparks und vergleichbare Anlagen sind auf Familien ausgerichtet.',
  },
  {
    q: 'Worauf sollte man bei der Unterkunft achten?',
    a: 'Als Alleinerziehende/r sollte die Unterkunft vor allem praktisch sein: kein Durchgangszimmer für das Kind, eine Küche oder Küchenzeile für spontane Mahlzeiten, Lage in Gehdistanz zu Aktivitäten und nach Möglichkeit kein aufwändiger Check-in-Prozess. Ferienwohnungen bieten meist mehr Flexibilität als Hotelzimmer. Bewertungen anderer Familien geben oft wertvolle Hinweise.',
  },
];

const BTN_PRIMARY = {
  display: 'inline-flex', alignItems: 'center', gap: '8px',
  padding: '14px 28px', borderRadius: '14px',
  background: 'linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%)',
  color: '#FFFFFF', textDecoration: 'none',
  fontSize: '15px', fontWeight: 700,
  boxShadow: '0 6px 24px rgba(14,165,233,0.40)',
  fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
};

const BTN_GHOST = {
  display: 'inline-flex', alignItems: 'center', gap: '8px',
  padding: '14px 28px', borderRadius: '14px',
  background: 'rgba(255,255,255,0.08)', border: '1.5px solid rgba(255,255,255,0.18)',
  color: '#E2E8F0', textDecoration: 'none',
  fontSize: '15px', fontWeight: 600,
  fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
};

const ARROW_ICON = (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);

const CHECK_ICON = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0EA5E9" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

export default function AlleinerziehendePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main>

        {/* ── 1. HERO ──────────────────────────────────────────────────────────── */}
        <section style={{
          position: 'relative',
          paddingTop: 'calc(80px + 80px)',
          paddingBottom: '80px',
          background: 'linear-gradient(135deg, #0F172A 0%, #12324a 60%, #0EA5E9 160%)',
          overflow: 'hidden',
          minHeight: 'clamp(520px, 65vh, 680px)',
        }}>
          <div aria-hidden="true" style={{
            position: 'absolute', top: '5%', right: '-5%',
            width: '500px', height: '500px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(14,165,233,0.13) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />
          <div aria-hidden="true" style={{
            position: 'absolute', bottom: '-20%', left: '-8%',
            width: '400px', height: '400px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(99,102,241,0.09) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />

          <Container>
            <div style={{ display: 'flex', alignItems: 'center', gap: '48px', flexWrap: 'wrap' }}>
              {/* Text */}
              <div style={{ flex: '1 1 340px', minWidth: 0, position: 'relative', zIndex: 2 }}>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  padding: '6px 16px', borderRadius: '40px', marginBottom: '24px',
                  background: 'rgba(14,165,233,0.12)', border: '1px solid rgba(14,165,233,0.30)',
                }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
                  </svg>
                  <span style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#38BDF8', fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)' }}>
                    Reisen mit Kind
                  </span>
                </div>

                <h1 style={{
                  fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                  fontSize: 'clamp(28px, 5vw, 50px)', fontWeight: 900,
                  lineHeight: 1.12, letterSpacing: '-0.03em',
                  color: '#FFFFFF', margin: '0 0 20px',
                  textShadow: '0 2px 16px rgba(0,0,0,0.25)',
                }}>
                  Urlaub für{' '}
                  <span style={{
                    background: 'linear-gradient(135deg, #38BDF8 0%, #22D3EE 100%)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                  }}>
                    Alleinerziehende
                  </span>
                  {' '}mit Kind
                </h1>

                <p style={{
                  fontSize: 'clamp(15px, 1.8vw, 18px)', color: '#CBD5E1',
                  lineHeight: 1.7, margin: '0 0 36px', maxWidth: '520px',
                }}>
                  Finde Reiseideen, die zu deinem Alltag passen: bezahlbar, kinderfreundlich, sicher und ohne unnötigen Planungsstress.
                </p>

                <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                  <a href="/urlaub-fuer-alleinerziehende/planen" style={BTN_PRIMARY}>
                    Urlaub mit Kind planen
                    {ARROW_ICON}
                  </a>
                  <a href="#reiseideen" style={BTN_GHOST}>
                    Reiseideen ansehen
                  </a>
                </div>
              </div>

              {/* Hero image */}
              <div style={{
                flex: '0 1 340px', display: 'flex', alignItems: 'center',
                justifyContent: 'center', minHeight: '260px',
                position: 'relative', zIndex: 2,
              }}>
                <AlleinerziehendHeroImage />
              </div>
            </div>
          </Container>
        </section>

        {/* ── 2. PROBLEM / EINFÜHLUNG ─────────────────────────────────────────── */}
        <section style={{ background: '#F8FAFF', paddingTop: '80px', paddingBottom: '80px' }}>
          <Container>
            <div style={{ maxWidth: '760px', margin: '0 auto' }}>
              <p style={{
                fontSize: '12px', fontWeight: 700, letterSpacing: '0.12em',
                textTransform: 'uppercase', color: '#0EA5E9', marginBottom: '16px',
                fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
              }}>
                Die Realität
              </p>
              <h2 style={{
                fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                fontSize: 'clamp(22px, 3.5vw, 36px)', fontWeight: 800,
                color: '#0F172A', margin: '0 0 20px', lineHeight: 1.2,
              }}>
                Warum Urlaub für Alleinerziehende oft anspruchsvoller ist
              </h2>
              <p style={{
                fontSize: '16px', color: '#475569', lineHeight: 1.75,
                margin: '0 0 40px',
              }}>
                Wer als alleinerziehende Person mit Kind verreist, trägt die komplette Organisation allein. Keine zweite Person, die mal kurz übernimmt, beim Koffer tragen hilft oder das Kind beschäftigt, während man sich kurz hinsetzt. Das ist kein Mitleid – das ist schlicht die Ausgangslage, die gute Reiseplanung berücksichtigen muss.
              </p>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '16px',
              }}>
                {PROBLEM_POINTS.map((p) => (
                  <div key={p.label} style={{
                    background: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    borderRadius: '16px',
                    padding: '20px 24px',
                    display: 'flex', gap: '14px', alignItems: 'flex-start',
                  }}>
                    <div style={{
                      flexShrink: 0,
                      width: '32px', height: '32px', borderRadius: '10px',
                      background: 'rgba(14,165,233,0.08)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      marginTop: '2px',
                    }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0EA5E9" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                      </svg>
                    </div>
                    <div>
                      <p style={{ fontWeight: 700, fontSize: '14px', color: '#0F172A', margin: '0 0 4px', fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)' }}>
                        {p.label}
                      </p>
                      <p style={{ fontSize: '14px', color: '#64748B', margin: 0, lineHeight: 1.6 }}>
                        {p.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </section>

        {/* ── 3. VORTEILE / WAS APEAROUND BEACHTET ───────────────────────────── */}
        <section style={{ background: '#FFFFFF', paddingTop: '80px', paddingBottom: '80px' }}>
          <Container>
            <div style={{ maxWidth: '760px', margin: '0 auto' }}>
              <p style={{
                fontSize: '12px', fontWeight: 700, letterSpacing: '0.12em',
                textTransform: 'uppercase', color: '#0EA5E9', marginBottom: '16px',
                fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
              }}>
                Unser Ansatz
              </p>
              <h2 style={{
                fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                fontSize: 'clamp(22px, 3.5vw, 36px)', fontWeight: 800,
                color: '#0F172A', margin: '0 0 16px', lineHeight: 1.2,
              }}>
                Worauf ApeAround bei Reiseideen für Alleinerziehende achtet
              </h2>
              <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.75, margin: '0 0 40px' }}>
                Gute Reisevorschläge für Alleinerziehende unterscheiden sich von allgemeinen Familienreisen. Sie berücksichtigen die praktische Seite: Was ist wirklich machbar, wenn man allein plant und allein reist?
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {BENEFIT_POINTS.map((b) => (
                  <div key={b.label} style={{
                    display: 'flex', gap: '14px', alignItems: 'flex-start',
                    padding: '20px 24px',
                    border: '1px solid #F1F5F9',
                    borderRadius: '16px',
                    background: '#FAFCFF',
                  }}>
                    <div style={{ flexShrink: 0, marginTop: '2px' }}>
                      {CHECK_ICON}
                    </div>
                    <div>
                      <p style={{ fontWeight: 700, fontSize: '15px', color: '#0F172A', margin: '0 0 4px', fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)' }}>
                        {b.label}
                      </p>
                      <p style={{ fontSize: '14px', color: '#64748B', margin: 0, lineHeight: 1.65 }}>
                        {b.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </section>

        {/* ── 4. REISEIDEEN ───────────────────────────────────────────────────── */}
        <section id="reiseideen" style={{ background: '#F8FAFF', paddingTop: '80px', paddingBottom: '80px' }}>
          <Container>
            <div style={{ maxWidth: '900px', margin: '0 auto' }}>
              <p style={{
                fontSize: '12px', fontWeight: 700, letterSpacing: '0.12em',
                textTransform: 'uppercase', color: '#0EA5E9', marginBottom: '16px',
                fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
              }}>
                Urlaubsarten
              </p>
              <h2 style={{
                fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                fontSize: 'clamp(22px, 3.5vw, 36px)', fontWeight: 800,
                color: '#0F172A', margin: '0 0 16px', lineHeight: 1.2,
              }}>
                Passende Reisearten für Alleinerziehende mit Kind
              </h2>
              <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.75, margin: '0 0 48px', maxWidth: '600px' }}>
                Nicht jede Reiseart ist gleich gut geeignet. Diese sechs Varianten funktionieren erfahrungsgemäß gut, wenn man allein mit Kind unterwegs ist.
              </p>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '24px',
              }}>
                {TRAVEL_TYPES.map((t) => (
                  <div key={t.title} style={{
                    background: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    borderRadius: '20px',
                    padding: '28px 24px',
                    boxShadow: '0 2px 12px rgba(15,23,42,0.05)',
                  }}>
                    <div style={{
                      width: '48px', height: '48px', borderRadius: '14px',
                      background: 'linear-gradient(135deg, rgba(14,165,233,0.10) 0%, rgba(6,182,212,0.10) 100%)',
                      border: '1px solid rgba(14,165,233,0.15)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#0EA5E9', marginBottom: '18px',
                    }}>
                      {t.icon}
                    </div>
                    <h3 style={{
                      fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                      fontSize: '17px', fontWeight: 700, color: '#0F172A',
                      margin: '0 0 10px',
                    }}>
                      {t.title}
                    </h3>
                    <p style={{ fontSize: '14px', color: '#64748B', lineHeight: 1.7, margin: 0 }}>
                      {t.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </section>

        {/* ── 5. EHRLICHER HINWEIS ────────────────────────────────────────────── */}
        <section style={{ background: '#FFFFFF', paddingTop: '72px', paddingBottom: '72px' }}>
          <Container>
            <div style={{
              maxWidth: '720px', margin: '0 auto',
              background: 'linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%)',
              border: '1px solid #BAE6FD',
              borderRadius: '24px', padding: '40px 48px',
            }}>
              <p style={{
                fontSize: '12px', fontWeight: 700, letterSpacing: '0.12em',
                textTransform: 'uppercase', color: '#0EA5E9', marginBottom: '12px',
                fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
              }}>
                Ehrliche Einschätzung
              </p>
              <h2 style={{
                fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                fontSize: 'clamp(20px, 3vw, 28px)', fontWeight: 800,
                color: '#0F172A', margin: '0 0 16px',
              }}>
                Nicht jedes Reiseziel passt zu jeder Familie
              </h2>
              <p style={{ fontSize: '15px', color: '#475569', lineHeight: 1.75, margin: '0 0 16px' }}>
                Was für eine Familie mit zwei Erwachsenen entspannend ist, kann für eine alleinerziehende Person mit Kleinkind anstrengend sein – und umgekehrt. Alter des Kindes, eigenes Budget, verfügbare Urlaubszeit, Anreiseweg und gewünschter Komfortgrad spielen alle eine entscheidende Rolle.
              </p>
              <p style={{ fontSize: '15px', color: '#475569', lineHeight: 1.75, margin: 0 }}>
                Genau deshalb macht eine KI-gestützte Reiseplanung hier Sinn: Statt allgemeiner Listen bekommst du Vorschläge, die zu deiner konkreten Situation passen – nicht zu einer Durchschnittsfamilie.
              </p>
            </div>
          </Container>
        </section>

        {/* ── 6. CTA ──────────────────────────────────────────────────────────── */}
        <section id="alleinerziehend" style={{
          position: 'relative',
          paddingTop: '96px', paddingBottom: '96px',
          background: 'linear-gradient(135deg, #0F172A 0%, #12324a 60%, #0EA5E9 160%)',
          overflow: 'hidden',
        }}>
          <div aria-hidden="true" style={{
            position: 'absolute', top: '-10%', right: '-5%',
            width: '450px', height: '450px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(14,165,233,0.15) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />
          <Container>
            <div style={{ maxWidth: '640px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 2 }}>
              <h2 style={{
                fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                fontSize: 'clamp(24px, 4vw, 42px)', fontWeight: 900,
                lineHeight: 1.15, letterSpacing: '-0.02em',
                color: '#FFFFFF', margin: '0 0 20px',
              }}>
                Lass ApeAround passende Reiseideen für dich finden
              </h2>
              <p style={{
                fontSize: 'clamp(15px, 1.8vw, 17px)', color: '#CBD5E1',
                lineHeight: 1.7, margin: '0 0 40px',
              }}>
                Beantworte wenige Fragen und erhalte Reisevorschläge, die besser zu dir, deinem Kind und eurem Budget passen.
              </p>
              <a href="/urlaub-fuer-alleinerziehende/planen" style={{
                ...BTN_PRIMARY,
                padding: '16px 36px',
                fontSize: '16px',
              }}>
                Urlaub mit Kind planen
                {ARROW_ICON}
              </a>
            </div>
          </Container>
        </section>

        {/* ── 7. FAQ ──────────────────────────────────────────────────────────── */}
        <section style={{ background: '#F8FAFF', paddingTop: '80px', paddingBottom: '80px' }}>
          <Container>
            <div style={{ maxWidth: '760px', margin: '0 auto' }}>
              <p style={{
                fontSize: '12px', fontWeight: 700, letterSpacing: '0.12em',
                textTransform: 'uppercase', color: '#0EA5E9', marginBottom: '16px',
                fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
              }}>
                Häufige Fragen
              </p>
              <h2 style={{
                fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                fontSize: 'clamp(22px, 3.5vw, 36px)', fontWeight: 800,
                color: '#0F172A', margin: '0 0 48px', lineHeight: 1.2,
              }}>
                Fragen zu Urlaub für Alleinerziehende
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {FAQ_ITEMS.map((item) => (
                  <div key={item.q} style={{
                    background: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    borderRadius: '16px',
                    padding: '28px 32px',
                  }}>
                    <h3 style={{
                      fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                      fontSize: '16px', fontWeight: 700, color: '#0F172A',
                      margin: '0 0 12px', lineHeight: 1.35,
                    }}>
                      {item.q}
                    </h3>
                    <p style={{ fontSize: '14px', color: '#475569', lineHeight: 1.75, margin: 0 }}>
                      {item.a}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </section>

      </main>
      <Footer />
    </>
  );
}

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Container from '@/components/layout/Container';
import MotorcycleFunnel from '@/components/motorradurlaub/funnel/MotorcycleFunnel';

export const metadata = {
  title: 'Motorradurlaub planen | Finde passende Routen & Regionen',
  description:
    'Plane deinen Motorradurlaub mit ApeAround. Finde passende Regionen, Strecken, Hotels und Reiseideen für deinen Urlaub auf zwei Rädern.',
  alternates: {
    canonical: 'https://apearound.de/motorradurlaub/planen',
  },
  openGraph: {
    title: 'Motorradurlaub planen | ApeAround',
    description: 'Finde passende Regionen, Strecken und Hotels für deinen Motorradurlaub.',
    url: 'https://apearound.de/motorradurlaub/planen',
  },
};

const FAQ_ITEMS = [
  {
    question: 'Wie plant man einen Motorradurlaub?',
    answer: 'Einen Motorradurlaub plant man am besten in mehreren Schritten: Zuerst Reisedauer und tägliche Kilometerleistung festlegen, dann passende Regionen anhand von Fahrstil und Zielgebiet wählen. Danach Unterkünfte mit gesichertem Motorradstellplatz suchen, Ausrüstung und Dokumente prüfen und eine grobe Route planen – mit Puffer für Pausen und Spontanstopps.',
  },
  {
    question: 'Wie viele Kilometer pro Tag sind beim Motorradurlaub sinnvoll?',
    answer: 'Für Genussfahrer sind 150–300 km pro Tag ideal – genug Kilometer für schöne Strecken, aber mit Zeit für Pausen und Sightseeing. Sportliche Fahrer fahren 300–500 km. Wichtiger als die Distanz ist das regelmäßige Pausieren: Alle 1,5 bis 2 Stunden eine Pause erhält die Konzentration.',
  },
  {
    question: 'Welche Regionen eignen sich für Motorradurlaub?',
    answer: 'Die besten Motorradregionen Europas sind die Dolomiten und der Großglockner für Passfahrer, der Schwarzwald und die Eifel für Deutschland, die Côte d\'Azur und Provence für Frankreich sowie die Amalfiküste für Italien. Norwegen mit Trollstigen und den Fjorden gilt als Traumziel für abenteuerlustige Motorradreisende.',
  },
  {
    question: 'Welche Unterkunft eignet sich am besten für Motorradreisende?',
    answer: 'Motorradhotels und Pensionen mit gesichertem Stellplatz – idealerweise überdacht oder in einer Tiefgarage – sind die erste Wahl. Viele bieten spezielle Leistungen wie Trockenräume, Werkzeugbänke und frühe Frühstückszeiten. Auch Campingplätze mit Bikerzonen sind beliebt für mehr Flexibilität.',
  },
  {
    question: 'Wann ist die beste Reisezeit für Motorradtouren?',
    answer: 'Die Hauptsaison für Motorradurlaub in Europa ist Mai bis September. Alpenpässe sind typischerweise von Juni bis Oktober schneefrei. Skandinavien eignet sich am besten von Juni bis August. Süditalien und Frankreich lassen sich bereits ab April bereisen, Herbsttouren bis Oktober sind ebenfalls möglich.',
  },
];

export default function MotorcyclePlanenPage() {
  const webPageJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Motorradurlaub planen',
    description: 'Regelbasierter Planungshelfer für Motorradurlaub: Finde passende Regionen, Strecken und Unterkünfte basierend auf deinen Präferenzen.',
    url: 'https://apearound.de/motorradurlaub/planen',
    isPartOf: { '@id': 'https://apearound.de' },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Startseite', item: 'https://apearound.de' },
        { '@type': 'ListItem', position: 2, name: 'Motorradurlaub', item: 'https://apearound.de/motorradurlaub' },
        { '@type': 'ListItem', position: 3, name: 'Planen', item: 'https://apearound.de/motorradurlaub/planen' },
      ],
    },
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_ITEMS.map(({ question, answer }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: { '@type': 'Answer', text: answer },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <Header />

      <main style={{ minHeight: '100vh', paddingTop: '80px', background: '#F1F5F9' }}>
        {/* Intro header */}
        <div style={{ background: '#0F172A', paddingTop: 'clamp(36px, 5vw, 56px)', paddingBottom: 'clamp(28px, 4vw, 44px)' }}>
          <Container size="sm">
            <p style={{
              fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
              color: '#38BDF8', margin: '0 0 14px',
              fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
            }}>
              Motorradurlaub
            </p>
            <h1 style={{
              fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
              fontSize: 'clamp(26px, 4.5vw, 40px)', fontWeight: 900,
              color: '#FFFFFF', margin: '0 0 14px',
              letterSpacing: '-0.02em', lineHeight: 1.15,
            }}>
              Motorradurlaub planen
            </h1>
            <p style={{ fontSize: 'clamp(14px, 2vw, 16px)', color: 'rgba(255,255,255,0.70)', margin: 0, lineHeight: 1.65, maxWidth: '520px' }}>
              Beantworte 6 kurze Fragen – du erhältst passende Regionen, Tagesetappen, Reisezeit und Unterkunftsempfehlungen.
            </p>
          </Container>
        </div>

        {/* Funnel */}
        <MotorcycleFunnel />

        {/* FAQ (hidden, for SEO) */}
        <section style={{ background: '#F1F5F9', paddingTop: 'clamp(48px, 6vw, 64px)', paddingBottom: 'clamp(48px, 6vw, 72px)' }}>
          <Container size="sm">
            <h2 style={{
              fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
              fontSize: 'clamp(20px, 3vw, 26px)', fontWeight: 800,
              color: '#0F172A', margin: '0 0 28px', letterSpacing: '-0.02em',
            }}>
              Häufige Fragen zum Motorradurlaub
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {FAQ_ITEMS.map(({ question, answer }) => (
                <details key={question} style={{
                  background: '#FFFFFF', border: '1px solid #E2E8F0',
                  borderRadius: '16px', overflow: 'hidden',
                }}>
                  <summary style={{
                    padding: '18px 22px', cursor: 'pointer',
                    fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                    fontSize: '15px', fontWeight: 700, color: '#0F172A',
                    listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  }}>
                    {question}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flexShrink: 0 }}>
                      <polyline points="6 9 12 15 18 9"/>
                    </svg>
                  </summary>
                  <div style={{ padding: '0 22px 18px', fontSize: '14px', color: '#64748B', lineHeight: 1.7 }}>
                    {answer}
                  </div>
                </details>
              ))}
            </div>
          </Container>
        </section>
      </main>

      <Footer />
    </>
  );
}

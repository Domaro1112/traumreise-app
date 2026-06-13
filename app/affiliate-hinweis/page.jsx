import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Container from '@/components/layout/Container';

export const metadata = {
  title: 'Affiliate-Hinweis | Reisemonkey',
  description: 'Informationen zu Affiliate-Links, Provisionen und Transparenz bei Reisemonkey.',
  robots: { index: true, follow: true },
};

const SECTIONS = [
  {
    heading: 'Warum dieser Hinweis?',
    items: [
      'Reisemonkey ist eine unabhängige Reise- und Inspirationsplattform. Unser Ziel ist es, passende Reiseideen, Reiseanbieter und Urlaubsempfehlungen bereitzustellen.',
      'Im Sinne der Transparenz informieren wir dich auf dieser Seite offen darüber, wie Reisemonkey finanziert wird und wie Affiliate-Links auf unserer Plattform funktionieren.',
    ],
  },
  {
    heading: 'Affiliate-Links',
    items: [
      'Ein Teil der auf Reisemonkey verwendeten Links sind sogenannte Affiliate-Links. Du erkennst sie daran, dass sie zu externen Anbietern wie Booking.com, Skyscanner, CHECK24 oder GetYourGuide führen.',
      'Wenn du über einen solchen Link eine Buchung oder einen Kauf tätigst, kann Reisemonkey eine Provision vom jeweiligen Anbieter erhalten.',
      'Für dich entstehen dadurch keine zusätzlichen Kosten. Der Preis, den du beim Anbieter zahlst, ist derselbe – unabhängig davon, ob du den Link über Reisemonkey oder direkt aufrufst.',
    ],
  },
  {
    heading: 'Unabhängigkeit',
    items: [
      'Unsere Reisevorschläge, Empfehlungen und redaktionellen Inhalte werden unabhängig von bestehenden Affiliate-Partnerschaften erstellt.',
      'Affiliate-Partnerschaften beeinflussen nicht die Auswahl der Reiseziele, die Reihenfolge der Vorschläge oder die inhaltliche Bewertung der Partner.',
      'KI-gestützte Reiseempfehlungen basieren ausschließlich auf den Angaben des Nutzers – nicht auf kommerziellen Interessen.',
    ],
  },
  {
    heading: 'Partner',
    intro: 'Zu den Partnern, mit denen Reisemonkey Affiliate-Beziehungen unterhält oder unterhalten kann, gehören unter anderem:',
    list: [
      'Booking.com',
      'Skyscanner',
      'CHECK24 (Urlaub & Mietwagen)',
      'GetYourGuide',
      'trivago',
      'Weitere Reise- und Vergleichsanbieter',
    ],
    outro: 'Diese Liste ist nicht abschließend und kann sich jederzeit ändern.',
  },
  {
    heading: 'Finanzierung',
    intro: 'Affiliate-Provisionen helfen dabei:',
    list: [
      'Den Betrieb der Plattform zu finanzieren',
      'Neue Funktionen und Inhalte zu entwickeln',
      'Alle Inhalte für Nutzer kostenlos bereitzustellen',
      'Reisemonkey langfristig weiterzuentwickeln',
    ],
    outro: 'Reisemonkey erhebt keine Gebühren von Nutzern und finanziert sich ausschließlich über Affiliate-Provisionen und Werbepartnerschaften.',
  },
  {
    heading: 'Kontakt',
    items: [
      'Bei Fragen zur Affiliate-Kennzeichnung, zu bestehenden Partnerschaften oder zu kommerziellen Inhalten kannst du die Kontaktmöglichkeiten im Impressum nutzen.',
    ],
  },
];

const headingStyle = {
  fontSize: '12px',
  fontWeight: 700,
  letterSpacing: '2px',
  textTransform: 'uppercase',
  color: '#0EA5E9',
  marginBottom: '10px',
  fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
};

const textStyle = {
  fontSize: '15px',
  color: '#475569',
  lineHeight: 1.8,
  margin: '0 0 10px',
};

export default function AffiliateHinweisPage() {
  return (
    <>
      <Header />
      <main style={{ paddingTop: '80px', background: '#FFFFFF', minHeight: '100vh' }}>
        <div style={{ paddingTop: '80px', paddingBottom: '100px' }}>
          <Container size="sm">
            <h1
              style={{
                fontFamily: 'var(--font-heading, "Poppins", system-ui, sans-serif)',
                fontSize: 'clamp(28px, 4vw, 44px)',
                fontWeight: 700,
                color: '#0F172A',
                marginBottom: '8px',
                letterSpacing: '-0.02em',
              }}
            >
              Transparenz & Affiliate-Hinweis
            </h1>
            <p style={{ fontSize: '14px', color: '#94A3B8', marginBottom: '48px' }}>
              Letzte Aktualisierung: 11. Juni 2026
            </p>

            <div
              style={{
                background: '#F8FAFF',
                border: '1px solid #E2E8F0',
                borderRadius: '20px',
                padding: '36px',
              }}
            >
              {SECTIONS.map((section, i) => (
                <div
                  key={section.heading}
                  style={{ marginBottom: i < SECTIONS.length - 1 ? '36px' : 0 }}
                >
                  <h2 style={headingStyle}>{section.heading}</h2>

                  {section.intro && (
                    <p style={textStyle}>{section.intro}</p>
                  )}

                  {section.list && (
                    <ul style={{ margin: '0 0 10px', paddingLeft: '20px' }}>
                      {section.list.map((item, j) => (
                        <li key={j} style={{ ...textStyle, margin: '0 0 4px' }}>
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}

                  {section.outro && (
                    <p style={textStyle}>{section.outro}</p>
                  )}

                  {section.items?.map((item, j) => (
                    <p key={j} style={textStyle}>{item}</p>
                  ))}
                </div>
              ))}
            </div>
          </Container>
        </div>
      </main>
      <Footer />
    </>
  );
}

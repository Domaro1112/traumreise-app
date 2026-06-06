import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Container from '@/components/layout/Container';

export const metadata = {
  title: 'Impressum – Traumreise',
  description: 'Impressum und rechtliche Angaben von Traumreise.',
};

export default function Impressum() {
  return (
    <>
      <Header />
      <main style={{ paddingTop: '72px', background: '#07070f', minHeight: '100vh' }}>
        <div style={{ paddingTop: '80px', paddingBottom: '100px' }}>
          <Container size="sm">
            <h1
              style={{
                fontFamily: 'var(--font-playfair, "Playfair Display", Georgia, serif)',
                fontSize: 'clamp(28px, 4vw, 44px)',
                fontWeight: 700,
                color: '#fff',
                marginBottom: '48px',
              }}
            >
              Impressum
            </h1>

            <div
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '20px',
                padding: '36px',
              }}
            >
              {[
                { label: 'Angaben gemäß § 5 TMG', value: 'Traumreise\n[Vorname Nachname]\n[Straße Hausnummer]\n[PLZ Stadt]' },
                { label: 'Kontakt', value: 'E-Mail: kontakt@traumreise.de\nTelefon: +49 (0) XXX XXXXXXXX' },
                { label: 'Umsatzsteuer-ID', value: 'USt-IdNr.: DE XXXXXXXXX' },
                { label: 'Verantwortlich für den Inhalt', value: '[Vorname Nachname]\n[Adresse wie oben]' },
                { label: 'Streitschlichtung', value: 'Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: https://ec.europa.eu/consumers/odr. Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.' },
              ].map((item) => (
                <div key={item.label} style={{ marginBottom: '28px' }}>
                  <h2
                    style={{
                      fontSize: '13px',
                      fontWeight: 700,
                      letterSpacing: '2px',
                      textTransform: 'uppercase',
                      color: '#FFD700',
                      marginBottom: '10px',
                    }}
                  >
                    {item.label}
                  </h2>
                  <p
                    style={{
                      fontSize: '15px',
                      color: 'rgba(255,255,255,0.55)',
                      lineHeight: 1.8,
                      whiteSpace: 'pre-line',
                    }}
                  >
                    {item.value}
                  </p>
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

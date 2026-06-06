import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Container from '@/components/layout/Container';
import SectionTitle from '@/components/ui/SectionTitle';
import Button from '@/components/ui/Button';

export const metadata = {
  title: 'Über uns – Traumreise',
  description: 'Wir sind ein Team von Reise-Enthusiasten und KI-Experten. Unser Ziel: die perfekte Reise für jeden.',
};

export default function UeberUns() {
  return (
    <>
      <Header />
      <main style={{ paddingTop: '72px', background: '#07070f', minHeight: '100vh' }}>
        <div style={{ paddingTop: '80px', paddingBottom: '100px' }}>
          <Container size="sm">
            <SectionTitle
              label="Über uns"
              title="Traumreisen für"
              titleHighlight="echte Menschen"
              subtitle="Wir glauben, dass jeder eine Reise verdient, die wirklich zu ihm passt."
            />

            <div
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,215,0,0.12)',
                borderRadius: '24px',
                padding: 'clamp(32px, 5vw, 56px)',
                marginBottom: '40px',
              }}
            >
              <h2
                style={{
                  fontFamily: 'var(--font-playfair, "Playfair Display", Georgia, serif)',
                  fontSize: 'clamp(22px, 3vw, 30px)',
                  fontWeight: 700,
                  color: '#fff',
                  marginBottom: '20px',
                }}
              >
                Unsere Mission
              </h2>
              <p
                style={{
                  fontSize: '16px',
                  color: 'rgba(255,255,255,0.6)',
                  lineHeight: 1.8,
                  marginBottom: '20px',
                }}
              >
                Traumreise wurde gegründet, weil wir es leid waren, stundenlang in Reisebüros zu sitzen oder
                unzählige Webseiten zu vergleichen – nur um am Ende mit einem Standardpaket abzureisen, das
                sich wie eine Massenware anfühlt.
              </p>
              <p
                style={{
                  fontSize: '16px',
                  color: 'rgba(255,255,255,0.6)',
                  lineHeight: 1.8,
                  marginBottom: '20px',
                }}
              >
                Wir nutzen modernste KI-Technologie, um deine Persönlichkeit, deine Wünsche und deinen Stil
                zu verstehen – und finden dann das Reiseziel, das wirklich zu dir passt. Inkl. Hotels,
                Flügen und Aktivitäten.
              </p>
              <p
                style={{
                  fontSize: '16px',
                  color: 'rgba(255,255,255,0.6)',
                  lineHeight: 1.8,
                }}
              >
                Das alles <strong style={{ color: '#FFD700' }}>100% kostenlos</strong> und ohne versteckte
                Gebühren. Wir verdienen durch Partner-Provisionen, wenn du über unsere Links buchst – ohne
                Mehrkosten für dich.
              </p>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '20px',
                marginBottom: '48px',
              }}
            >
              {[
                { number: '50.000+', label: 'Reisen geplant' },
                { number: '4,8/5', label: 'Bewertung' },
                { number: '120+', label: 'Reiseziele' },
                { number: '100%', label: 'Kostenlos' },
              ].map((stat) => (
                <div
                  key={stat.label}
                  style={{
                    textAlign: 'center',
                    padding: '28px 20px',
                    borderRadius: '16px',
                    background: 'rgba(255,215,0,0.05)',
                    border: '1px solid rgba(255,215,0,0.15)',
                  }}
                >
                  <div
                    style={{
                      fontFamily: 'var(--font-playfair, "Playfair Display", Georgia, serif)',
                      fontSize: '36px',
                      fontWeight: 700,
                      background: 'linear-gradient(135deg, #FFD700 0%, #FF8C00 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      marginBottom: '8px',
                    }}
                  >
                    {stat.number}
                  </div>
                  <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.45)' }}>{stat.label}</div>
                </div>
              ))}
            </div>

            <div style={{ textAlign: 'center' }}>
              <Button href="/finder" size="lg">
                Jetzt deine Traumreise finden ✈️
              </Button>
            </div>
          </Container>
        </div>
      </main>
      <Footer />
    </>
  );
}

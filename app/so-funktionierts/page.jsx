import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Container from '@/components/layout/Container';
import SectionTitle from '@/components/ui/SectionTitle';
import HowItWorksSection from '@/components/landing/HowItWorksSection';

export const metadata = {
  title: 'So funktioniert\'s – Traumreise',
  description: 'In 3 einfachen Schritten zu deiner persönlichen Traumreise mit KI-Unterstützung.',
};

export default function SoFunktionierts() {
  return (
    <>
      <Header />
      <main style={{ paddingTop: '72px', background: '#07070f', minHeight: '100vh' }}>
        <div style={{ paddingTop: '80px', paddingBottom: '40px' }}>
          <Container>
            <SectionTitle
              label="Traumreise AI"
              title="So funktioniert's"
              subtitle="Unser KI-Reiseplaner findet in wenigen Minuten dein perfektes Reiseziel – ganz persönlich und kostenlos."
            />
          </Container>
        </div>
        <HowItWorksSection />
      </main>
      <Footer />
    </>
  );
}

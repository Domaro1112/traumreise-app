import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Container from '@/components/layout/Container';
import SectionTitle from '@/components/ui/SectionTitle';
import DestinationCards from '@/components/landing/DestinationCards';

export const metadata = {
  title: 'Inspiration – Traumreise',
  description: 'Entdecke traumhafte Reiseziele weltweit – von Bali bis Marrakesch.',
};

export default function Inspiration() {
  return (
    <>
      <Header />
      <main style={{ paddingTop: '72px', background: '#07070f', minHeight: '100vh' }}>
        <div style={{ paddingTop: '80px', paddingBottom: '0' }}>
          <Container>
            <SectionTitle
              label="Reiseziele entdecken"
              title="Lass dich"
              titleHighlight="inspirieren"
              subtitle="Von tropischen Stränden bis zu verschneiten Gipfeln – finde das Reiseziel, das zu dir passt."
            />
          </Container>
        </div>
        <DestinationCards />
      </main>
      <Footer />
    </>
  );
}

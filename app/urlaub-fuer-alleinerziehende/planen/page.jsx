import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PlanenFunnel from '@/components/urlaub-alleinerziehende/PlanenFunnel';

export const metadata = {
  title: 'Urlaub für Alleinerziehende planen | ApeAround',
  description:
    'Plane stressarme Reiseideen für Alleinerziehende mit Kind: kurze Wege, passende Unterkünfte, faire Budgets und familienfreundliche Ziele mit ApeAround.',
  robots: { index: false },
};

export default function PlanenPage() {
  return (
    <>
      <Header />
      <main>
        <PlanenFunnel />
      </main>
      <Footer />
    </>
  );
}

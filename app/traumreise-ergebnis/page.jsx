import { Suspense } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import TravelResultsPage from '@/components/results/TravelResultsPage';

export const metadata = {
  title: 'Deine Traumreise | Reisemonkey',
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <>
      <Header />
      {/* padding-top clears the fixed header (minHeight 72px + 16px breathing room) */}
      <main style={{ paddingTop: '88px', minHeight: '100vh' }}>
        <Suspense>
          <TravelResultsPage />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/landing/HeroSection';
import TravelFinderBox from '@/components/landing/TravelFinderBox';
import FeatureStrip from '@/components/landing/FeatureStrip';
import DestinationCards from '@/components/landing/DestinationCards';
import PartnerTrustSection from '@/components/landing/PartnerTrustSection';
import HowItWorksSection from '@/components/landing/HowItWorksSection';
import NewsletterSection from '@/components/landing/NewsletterSection';

export const metadata = {
  title: 'Traumreise – Deine persönliche KI-Reiseberaterin',
  description:
    'Erzähl uns von dir – unsere KI findet dein perfektes Reiseziel inkl. Hotels, Flügen & Aktivitäten. 100% kostenlos.',
};

export default function LandingPage() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <TravelFinderBox />
        <FeatureStrip />
        <DestinationCards />
        <PartnerTrustSection />
        <HowItWorksSection />
        <NewsletterSection />
      </main>
      <Footer />
    </>
  );
}

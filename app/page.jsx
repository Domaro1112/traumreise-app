import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/landing/HeroSection';
import HomeTravelWizard from '@/components/landing/HomeTravelWizard';
import FeatureStrip from '@/components/landing/FeatureStrip';
import DestinationCards from '@/components/landing/DestinationCards';
import PartnerTrustSection from '@/components/landing/PartnerTrustSection';
import HowItWorksSection from '@/components/landing/HowItWorksSection';
import NewsletterSection from '@/components/landing/NewsletterSection';
import LatestBlogArticles from '@/components/landing/LatestBlogArticles';

export const metadata = {
  title: 'Traumreise – Deine persönliche KI-Reiseberaterin',
  description:
    'Erzähl uns von dir – wir finden dein perfektes Reiseziel inkl. Hotels, Flügen & Aktivitäten. 100% kostenlos.',
};

export default function LandingPage() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <HomeTravelWizard />
        <FeatureStrip />
        <DestinationCards />
        <PartnerTrustSection />
        <LatestBlogArticles />
        <HowItWorksSection />
        <NewsletterSection />
      </main>
      <Footer />
    </>
  );
}

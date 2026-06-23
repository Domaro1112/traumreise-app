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
import SpecialTeaserGrid from '@/components/landing/SpecialTeaserGrid';
import { listActiveSuggestions } from '@/repositories/homepage-suggestions';
import { FALLBACK_SUGGESTIONS } from '@/lib/homepage-suggestions';

export const metadata = {
  title: 'Traumreise – Deine persönliche KI-Reiseberaterin',
  description:
    'Erzähl uns von dir – wir finden dein perfektes Reiseziel inkl. Hotels, Flügen & Aktivitäten. 100% kostenlos.',
};

export default async function LandingPage() {
  let suggestions = FALLBACK_SUGGESTIONS;
  try {
    const fromDb = await listActiveSuggestions();
    if (fromDb.length > 0) suggestions = fromDb;
  } catch {
    // Table not yet migrated or Supabase unavailable — fall back to static data
  }

  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <HomeTravelWizard />
        <FeatureStrip />
        <DestinationCards suggestions={suggestions} />
        <PartnerTrustSection />
        <LatestBlogArticles />
        <SpecialTeaserGrid />
        <HowItWorksSection />
        <NewsletterSection />
      </main>
      <Footer />
    </>
  );
}

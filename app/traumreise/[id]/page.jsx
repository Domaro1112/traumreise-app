import { notFound } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ResultPageClient from './ResultPageClient';
import { getSession } from '@/repositories/travel-funnel';
import { buildAffiliateUrls, DURATION_MAP } from '@/lib/travel/affiliateUrls';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const { id } = await params;
  try {
    const session = await getSession(id);
    const analysis = session?.generated_destinations;
    const first = analysis?.destinations?.[0];
    const title = first
      ? `Deine Traumreise: ${first.destination} & mehr | ApeAround`
      : 'Deine Traumreise | ApeAround';
    const description = first
      ? `Dein persönlicher KI-Reiseplan: ${analysis.destinations.map(d => d.destination).join(', ')} – Hotels, Aktivitäten, Reiseprofil und mehr.`
      : 'Dein persönlicher KI-Reiseplan von ApeAround.';
    return {
      title,
      description,
      robots:    { index: false, follow: false },
      alternates: { canonical: `/traumreise/${id}` },
      openGraph: {
        title,
        description,
        type: 'website',
        url:  `/traumreise/${id}`,
      },
    };
  } catch {
    return {
      title:  'Traumreise | ApeAround',
      robots: { index: false, follow: false },
    };
  }
}

export default async function TravelResultPage({ params }) {
  const { id } = await params;

  let session;
  try {
    session = await getSession(id);
  } catch {
    notFound();
  }

  const analysis = session?.generated_destinations;
  if (!analysis?.destinations?.length) {
    notFound();
  }

  // Rebuild affiliate URLs using stored budget/season/duration
  const { budget, season, duration } = session;
  const results = analysis.destinations.map(dest => ({
    ...dest,
    ...buildAffiliateUrls(dest, { budget, season, duration }),
  }));

  // Map stored duration value → TravelResultView format
  // Handles both raw funnel values (e.g. 'one_week') and already-mapped API values (e.g. 'week')
  const displayDuration = DURATION_MAP[duration] ?? duration ?? 'week';

  return (
    <>
      <Header />
      <main style={{ paddingTop: '88px', minHeight: '100vh' }}>
        <ResultPageClient
          sessionId={id}
          results={results}
          personality={analysis.personality}
          interests={session.mood_selection ?? []}
          packingList={analysis.packingList}
          surprise={analysis.surprise}
          duration={displayDuration}
        />
      </main>
      <Footer />
    </>
  );
}

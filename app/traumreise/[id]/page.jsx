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

  // Detect alleinerziehende context via funnel_type (reliable for new sessions).
  // Legacy fallback: parse personal_note for sessions before funnel_type was introduced.
  const isSingleParent =
    session.funnel_type === 'single_parent' ||
    (session.funnel_type == null && (session.personal_note ?? '').includes('alleinerziehend'));

  // Maps age-group label from personal_note → representative integer age for providers.
  function mapNoteChildAge(n) {
    if (!n) return null;
    if (n.includes('0–3 Jahre'))   return 2;
    if (n.includes('4–6 Jahre'))   return 5;
    if (n.includes('7–10 Jahre'))  return 8;
    if (n.includes('11–14 Jahre')) return 12;
    if (n.includes('15+ Jahre'))   return 15;
    return null; // mehrere Kinder → omit age param
  }
  const resultsAdults   = isSingleParent ? 1 : 2;
  const resultsChildren = isSingleParent ? 1 : 0;
  const resultsChildAge = isSingleParent ? mapNoteChildAge(session.personal_note ?? '') : null;

  const results = analysis.destinations.map(dest => ({
    ...dest,
    ...buildAffiliateUrls(dest, {
      budget, season, duration,
      adults:   resultsAdults,
      children: resultsChildren,
      childAge: resultsChildAge,
    }),
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
          budget={budget ?? null}
          needsEmailGate={!session.email_submitted_at}
        />
      </main>
      <Footer />
    </>
  );
}

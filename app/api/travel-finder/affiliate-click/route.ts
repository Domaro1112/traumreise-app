import { NextRequest, NextResponse } from 'next/server';
import { trackAffiliateClick } from '@/repositories/travel-funnel';
import { buildProviderUrl, buildDestinationSearchQuery, AFFILIATE_PROVIDERS } from '@/lib/affiliate-config';
import { generateAffiliateUrl } from '@/lib/affiliate';

interface DestinationPayload {
  name:                  string;
  country?:              string;
  region?:               string;
  affiliateSearchIntent?: string;
}

interface RequestBody {
  provider:    string;
  destination: DestinationPayload;
  sessionId?:  string;
  leadId?:     string;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as RequestBody;
    const { provider, destination, sessionId, leadId } = body;

    // Validate provider
    const isValidProvider = (id: string): id is keyof typeof AFFILIATE_PROVIDERS =>
      Object.prototype.hasOwnProperty.call(AFFILIATE_PROVIDERS, id);
    if (!provider || !isValidProvider(provider)) {
      return NextResponse.json({ error: 'Ungültiger Anbieter.' }, { status: 400 });
    }
    if (!destination?.name) {
      return NextResponse.json({ error: 'Zielname fehlt.' }, { status: 400 });
    }

    // Build URL and search query server-side — client never constructs these
    const searchQuery = buildDestinationSearchQuery(destination);
    const baseUrl = buildProviderUrl(provider, destination);

    if (!baseUrl) {
      return NextResponse.json({ error: 'URL konnte nicht gebaut werden.' }, { status: 500 });
    }

    // Inject affiliate ID from central settings (cached, non-blocking on error)
    const redirectUrl = await generateAffiliateUrl(provider, baseUrl);

    const referrer = request.headers.get('referer') ?? undefined;

    // Fire-and-forget tracking (non-blocking)
    trackAffiliateClick({
      sessionId:          sessionId           ?? null,
      leadId:             leadId              ?? null,
      destinationName:    destination.name,
      destinationCountry: destination.country ?? undefined,
      destinationRegion:  destination.region  ?? undefined,
      provider,
      affiliateUrl:       redirectUrl,
      searchQuery,
      referrer,
    }).catch(e => console.error('[affiliate-click] tracking error:', e));

    return NextResponse.json({ redirectUrl });
  } catch (err) {
    console.error('[travel-finder/affiliate-click]', err);
    // Never block a user redirect due to tracking failures
    return NextResponse.json({ error: 'Fehler beim Verarbeiten des Klicks.' }, { status: 500 });
  }
}

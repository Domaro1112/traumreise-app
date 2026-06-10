import { NextRequest, NextResponse } from 'next/server';
import { trackAffiliateClick } from '@/repositories/travel-funnel';

export async function POST(request: NextRequest) {
  try {
    const { sessionId, leadId, destinationName, provider, affiliateUrl } =
      (await request.json()) as {
        sessionId?:      string;
        leadId?:         string;
        destinationName: string;
        provider:        string;
        affiliateUrl:    string;
      };

    const referrer = request.headers.get('referer') ?? undefined;

    await trackAffiliateClick({
      sessionId:       sessionId  ?? null,
      leadId:          leadId     ?? null,
      destinationName,
      provider,
      affiliateUrl,
      referrer,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[travel-finder/affiliate-click]', err);
    // Non-blocking: always return success so the user redirect is not blocked
    return NextResponse.json({ success: true });
  }
}

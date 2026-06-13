import { NextRequest, NextResponse } from 'next/server';
import { generateAffiliateUrl, isAllowedAffiliateUrl } from '@/lib/affiliate';
import { createServerClient } from '@/lib/supabase/server';

// Affiliate-Redirects nicht indexieren — Route Handler liefern HTTP 302,
// was Crawler normalerweise nicht verfolgen. Explizit via robots.js gesteuert.
export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ provider: string }> }
) {
  const { provider } = await params;
  const targetUrl = request.nextUrl.searchParams.get('url') ?? '';

  // Pflichtparameter
  if (!targetUrl) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Sicherheit: nur erlaubte Domains durchlassen (kein Open Redirect)
  if (!isAllowedAffiliateUrl(targetUrl)) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Affiliate-ID injizieren (gecacht, non-blocking bei Fehler)
  let finalUrl = targetUrl;
  try {
    finalUrl = await generateAffiliateUrl(provider, targetUrl);
  } catch {
    // Weiterleitung ohne Affiliate-ID im Fehlerfall
  }

  // Klick-Tracking (fire-and-forget — blockiert die Weiterleitung nicht)
  try {
    const supabase = createServerClient();
    void supabase.from('affiliate_clicks').insert({
      provider,
      affiliate_url: finalUrl,
      referrer:      request.headers.get('referer') ?? null,
    });
  } catch { /* non-blocking */ }

  // HTTP 302 Weiterleitung
  const response = NextResponse.redirect(finalUrl, { status: 302 });
  // Keine Cache-Header — jeder Klick soll getrackt werden
  response.headers.set('Cache-Control', 'no-store');
  return response;
}

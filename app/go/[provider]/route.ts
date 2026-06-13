import { NextRequest, NextResponse } from 'next/server';
import { generateAffiliateUrl, isAllowedAffiliateUrl } from '@/lib/affiliate';
import { createServerClient } from '@/lib/supabase/server';

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

  // Sicherheit: nur erlaubte Domains — kein Open Redirect
  if (!isAllowedAffiliateUrl(targetUrl)) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Affiliate-ID injizieren (gecacht, niemals blockierend)
  let finalUrl = targetUrl;
  try {
    finalUrl = await generateAffiliateUrl(provider, targetUrl);
  } catch {
    // Weiterleitung ohne ID im Fehlerfall — kein Abbruch
  }

  // Klick-Tracking: echter Fire-and-Forget via async IIFE mit try/catch
  // Fehler im async-Pfad werden vollständig abgefangen — Redirect schlägt nie fehl.
  void (async () => {
    try {
      await createServerClient()
        .from('affiliate_clicks')
        .insert({
          provider,
          affiliate_url: finalUrl,
          user_agent:    request.headers.get('user-agent') ?? null,
          referrer:      request.headers.get('referer')    ?? null,
          // destination_name: null — /go/ hat keinen Destination-Kontext (nullable seit Migration)
        });
    } catch { /* non-blocking — Tracking-Fehler dürfen Redirect nie stoppen */ }
  })();

  // HTTP 302 — Redirect darf niemals am Tracking scheitern
  const response = NextResponse.redirect(finalUrl, { status: 302 });
  response.headers.set('Cache-Control', 'no-store');
  return response;
}

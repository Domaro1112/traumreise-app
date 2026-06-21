import { NextRequest, NextResponse } from 'next/server';
import { generateAffiliateUrl, injectAffiliateParam, isAllowedAffiliateUrl } from '@/lib/affiliate';
import { AFFILIATE_PROVIDERS } from '@/lib/affiliate-config';
import { getCachedAffiliateSettings } from '@/repositories/affiliate-settings';
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

  let finalUrl = targetUrl;

  try {
    const providerConfig = (AFFILIATE_PROVIDERS as Record<string, { network?: string; buildUrl?: (u?: string) => string }>)[provider];

    if (providerConfig?.network === 'awin' && providerConfig.buildUrl) {
      // AWIN-Anbieter: Tracking-URL nur aufbauen wenn Affiliate-ID konfiguriert + aktiviert.
      // targetUrl (die Such-URL des Anbieters) wird als ued= in den AWIN-Deeplink eingebettet.
      // Ohne ID gehen wir direkt zur sauberen Provider-URL (targetUrl) — kein AWIN-Redirect.
      const settings = await getCachedAffiliateSettings();
      const setting  = settings[provider];

      if (setting?.enabled && setting?.affiliate_id) {
        const awinBase = providerConfig.buildUrl(targetUrl);
        finalUrl = injectAffiliateParam(awinBase, 'awinaffid', setting.affiliate_id);
      }
      // else: finalUrl bleibt = targetUrl (saubere Provider-URL)
    } else {
      // Nicht-AWIN-Anbieter: bestehende Logik
      finalUrl = await generateAffiliateUrl(provider, targetUrl);
    }
  } catch {
    // Weiterleitung ohne Tracking im Fehlerfall — kein Abbruch
  }

  console.log('[GO_REDIRECT_HIT]', { provider, targetUrl, finalUrl, changed: finalUrl !== targetUrl });

  // Klick-Tracking: echter Fire-and-Forget via async IIFE mit try/catch
  void (async () => {
    try {
      await createServerClient()
        .from('affiliate_clicks')
        .insert({
          provider,
          affiliate_url: finalUrl,
          user_agent:    request.headers.get('user-agent') ?? null,
          referrer:      request.headers.get('referer')    ?? null,
        });
    } catch { /* non-blocking */ }
  })();

  const response = NextResponse.redirect(finalUrl, { status: 302 });
  response.headers.set('Cache-Control', 'no-store');
  return response;
}

import { NextRequest, NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/admin-auth';
import { getAffiliateSettings } from '@/repositories/affiliate-settings';
import { injectAffiliateParam, AFFILIATE_PARAMS } from '@/lib/affiliate';
import { AFFILIATE_PROVIDERS } from '@/lib/affiliate-config';

/**
 * GET /api/admin/affiliate/test?provider=booking&url=https://www.booking.com/...
 *
 * Simuliert exakt was /go/[provider] tut:
 * - Nicht-AWIN: injectAffiliateParam(targetUrl, param, id)
 * - AWIN: buildUrl(targetUrl) → injectAffiliateParam(awinBase, 'awinaffid', id)
 *
 * Liest direkt aus DB (kein Cache). Nur für eingeloggte Admins.
 */
export async function GET(request: NextRequest) {
  if (!await isAdminRequest(request)) {
    return NextResponse.json({ error: 'Nicht autorisiert.' }, { status: 401 });
  }

  const provider  = request.nextUrl.searchParams.get('provider') ?? 'booking';
  const inputUrl  = request.nextUrl.searchParams.get('url')
    ?? 'https://www.booking.com/index.de.html?label=test&sid=abc';

  // ── 1. DB direkt lesen (Cache umgangen) ──────────────────────────────────
  let dbSettings: { provider: string; affiliate_id: string; enabled: boolean }[] = [];
  let dbError: string | null = null;
  try {
    dbSettings = await getAffiliateSettings();
  } catch (err) {
    dbError = err instanceof Error ? err.message : String(err);
  }

  const providerRow  = dbSettings.find(s => s.provider === provider) ?? null;
  const affiliateId  = providerRow?.affiliate_id ?? null;
  const paramName    = (AFFILIATE_PARAMS as Record<string, string>)[provider] ?? null;
  const providerConf = (AFFILIATE_PROVIDERS as Record<string, any>)[provider];
  const isAwin       = providerConf?.network === 'awin';

  // ── 2. Finale URL berechnen (exakt wie /go/[provider]) ───────────────────
  let finalUrl: string | null = null;
  let buildError: string | null = null;

  if (affiliateId && paramName && providerRow?.enabled) {
    try {
      if (isAwin && providerConf?.buildUrl) {
        // AWIN: erst AWIN-Deeplink bauen (mit ued= als Ziel-URL), dann awinaffid injizieren
        const awinBase = providerConf.buildUrl(inputUrl);
        finalUrl = injectAffiliateParam(awinBase, 'awinaffid', affiliateId);
      } else {
        // Nicht-AWIN: Affiliate-Parameter direkt in Ziel-URL injizieren
        finalUrl = injectAffiliateParam(inputUrl, paramName, affiliateId);
      }
    } catch (err) {
      buildError = err instanceof Error ? err.message : String(err);
    }
  }

  const aidInjected = !!(paramName && affiliateId && finalUrl?.includes(`${paramName}=${affiliateId}`));

  // ── 3. Fallback-URL: was passiert ohne Affiliate-ID? ─────────────────────
  // Für AWIN: direkte Provider-URL (targetUrl). Für andere: targetUrl ohne ID.
  const fallbackUrl = isAwin
    ? inputUrl
    : inputUrl;

  // ── 4. Diagnose ──────────────────────────────────────────────────────────
  let diagnosis: string;
  if (dbError) {
    diagnosis = `❌ DB-Fehler: ${dbError} — Migration 20260613_affiliate_settings.sql noch nicht ausgeführt?`;
  } else if (!providerRow) {
    diagnosis = `❌ Kein Eintrag für Provider "${provider}" in affiliate_settings. Migration ausführen!`;
  } else if (!affiliateId) {
    diagnosis = `⚠️ affiliate_id ist leer. Im Admin-Panel unter Monetarisierung eintragen.`;
  } else if (!providerRow.enabled) {
    diagnosis = `❌ Provider "${provider}" ist deaktiviert (enabled = false).`;
  } else if (buildError) {
    diagnosis = `❌ URL-Aufbau fehlgeschlagen: ${buildError}`;
  } else if (aidInjected) {
    if (isAwin) {
      diagnosis = `✅ AWIN-Deeplink korrekt: awinaffid=${affiliateId} injiziert. Weiterleitung über awin1.com.`;
    } else {
      diagnosis = `✅ Korrekt: ${paramName}=${affiliateId} in URL injiziert.`;
    }
  } else {
    diagnosis = `❌ Unbekannter Fehler — URL wurde nicht modifiziert.`;
  }

  return NextResponse.json({
    test: {
      provider,
      input_url:      inputUrl,
      expected_param: paramName,
      is_awin:        isAwin,
      merchant_id:    isAwin ? (providerConf?.awinMerchantId ?? null) : null,
    },
    db: {
      error:        dbError,
      provider_row: providerRow,
      affiliate_id: affiliateId ? '***' + affiliateId.slice(-4) : '(leer)',
      enabled:      providerRow?.enabled ?? null,
      all_entries:  dbSettings.map(s => ({
        provider:     s.provider,
        affiliate_id: s.affiliate_id ? '***' + s.affiliate_id.slice(-4) : '(leer)',
        enabled:      s.enabled,
      })),
    },
    result: {
      final_url:    finalUrl,
      fallback_url: !finalUrl ? fallbackUrl : null,
      build_error:  buildError,
      aid_injected: aidInjected,
    },
    diagnosis,
    summary: {
      input:    inputUrl,
      output:   finalUrl ?? `(kein Redirect — Direkt zu: ${fallbackUrl})`,
      ok:       aidInjected,
      is_awin:  isAwin,
    },
  }, { status: 200 });
}

import { NextRequest, NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/admin-auth';
import { getAffiliateSettings } from '@/repositories/affiliate-settings';
import { generateAffiliateUrl, injectAffiliateParam, AFFILIATE_PARAMS } from '@/lib/affiliate';

/**
 * GET /api/admin/affiliate/test?provider=booking&url=https://www.booking.com/...
 *
 * Diagnose-Endpunkt: liest direkt aus der DB (kein Cache), testet die URL-Generierung
 * und gibt einen vollständigen Debug-Report zurück.
 * Nur für eingeloggte Admins zugänglich.
 */
export async function GET(request: NextRequest) {
  if (!await isAdminRequest(request)) {
    return NextResponse.json({ error: 'Nicht autorisiert.' }, { status: 401 });
  }

  const provider  = request.nextUrl.searchParams.get('provider') ?? 'booking';
  const inputUrl  = request.nextUrl.searchParams.get('url')
    ?? 'https://www.booking.com/index.de.html?label=test&sid=abc';

  // ── 1. Direkt aus DB lesen (Cache bewusst umgangen) ──────────────────────
  let dbSettings: { provider: string; affiliate_id: string; enabled: boolean }[] = [];
  let dbError: string | null = null;
  try {
    dbSettings = await getAffiliateSettings();
  } catch (err) {
    dbError = err instanceof Error ? err.message : String(err);
  }

  const providerRow = dbSettings.find(s => s.provider === provider) ?? null;
  const affiliateId = providerRow?.affiliate_id ?? null;
  const paramName   = (AFFILIATE_PARAMS as Record<string, string>)[provider] ?? null;

  // ── 2. Direkte Injektion (Logik-Test, unabhängig von DB-Lookup) ──────────
  const directInject = affiliateId && paramName
    ? injectAffiliateParam(inputUrl, paramName, affiliateId)
    : null;

  // ── 3. Voller generateAffiliateUrl-Durchlauf (inkl. Cache-Pfad) ──────────
  let generatedUrl: string | null = null;
  let generateError: string | null = null;
  try {
    generatedUrl = await generateAffiliateUrl(provider, inputUrl);
  } catch (err) {
    generateError = err instanceof Error ? err.message : String(err);
  }

  const aidInjected = !!(
    paramName &&
    affiliateId &&
    generatedUrl?.includes(`${paramName}=${affiliateId}`)
  );

  // ── 4. Diagnose ──────────────────────────────────────────────────────────
  let diagnosis: string;
  if (dbError) {
    diagnosis = `❌ DB-Fehler: ${dbError} — Migration 20260613_affiliate_settings.sql noch nicht ausgeführt?`;
  } else if (!providerRow) {
    diagnosis = `❌ Kein Eintrag für Provider "${provider}" in affiliate_settings. Migration ausführen!`;
  } else if (!affiliateId) {
    diagnosis = `❌ affiliate_id ist leer. Im Admin-Panel unter Monetarisierung speichern.`;
  } else if (!providerRow.enabled) {
    diagnosis = `❌ Provider "${provider}" ist deaktiviert (enabled = false).`;
  } else if (aidInjected) {
    diagnosis = `✅ Korrekt: ${paramName}=${affiliateId} in URL injiziert.`;
  } else {
    diagnosis = `❌ Unbekannter Fehler — URL wurde nicht modifiziert. generateError: ${generateError ?? 'keiner'}`;
  }

  return NextResponse.json({
    test: {
      provider,
      input_url:      inputUrl,
      expected_param: paramName,
    },
    db: {
      error:        dbError,
      provider_row: providerRow,
      affiliate_id: affiliateId,
      enabled:      providerRow?.enabled ?? null,
      all_entries:  dbSettings.map(s => ({
        provider:     s.provider,
        affiliate_id: s.affiliate_id ? '***' + s.affiliate_id.slice(-4) : '(leer)',
        enabled:      s.enabled,
      })),
    },
    result: {
      direct_inject:   directInject,
      generated_url:   generatedUrl,
      generate_error:  generateError,
      aid_injected:    aidInjected,
    },
    diagnosis,
    // Kurzform für schnelle Augen-Diagnose
    summary: {
      input:   inputUrl,
      output:  generatedUrl,
      ok:      aidInjected,
    },
  }, { status: 200 });
}

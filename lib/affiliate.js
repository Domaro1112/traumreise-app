/**
 * Affiliate-URL-Generator für ApeAround.
 * Server-side only — nie im Client-Bundle importieren.
 *
 * Liest Affiliate-IDs aus der Supabase-Tabelle `affiliate_settings` (gecacht).
 * Injiziert die ID als Query-Parameter in die Ziel-URL.
 */
import { getCachedAffiliateSettings } from '@/repositories/affiliate-settings';

// URL-Parameter pro Anbieter (nach offiziellem Partnerprogramm)
export const AFFILIATE_PARAMS = {
  booking:       'aid',
  getyourguide:  'partner_id',
  check24:       'pid',
  holidaycheck:  'ref',
  amazon:        'tag',
  expedia:       'affcid',
  trivago:       'ptId',
  skyscanner:    'associateid',
};

// Erlaubte Domains für den /go/[provider] Redirect (Open-Redirect-Schutz)
export const ALLOWED_BASE_DOMAINS = [
  'booking.com',
  'getyourguide.com', 'getyourguide.de',
  'check24.de',
  'holidaycheck.de',
  'amazon.de', 'amazon.com',
  'expedia.de', 'expedia.com',
  'trivago.de', 'trivago.com',
  'skyscanner.de', 'skyscanner.com',
];

/**
 * Prüft, ob eine URL zu einem erlaubten Affiliate-Domain gehört.
 * @param {string} rawUrl
 * @returns {boolean}
 */
export function isAllowedAffiliateUrl(rawUrl) {
  try {
    const { hostname } = new URL(rawUrl);
    return ALLOWED_BASE_DOMAINS.some(
      d => hostname === d || hostname.endsWith('.' + d)
    );
  } catch {
    return false;
  }
}

/**
 * Injiziert den Affiliate-Parameter in eine bestehende URL.
 * Intern – für Tests und Einzel-Operationen.
 *
 * @param {string} targetUrl
 * @param {string} paramName
 * @param {string} affiliateId
 * @returns {string}
 */
export function injectAffiliateParam(targetUrl, paramName, affiliateId) {
  try {
    const url = new URL(targetUrl);
    url.searchParams.set(paramName, affiliateId);
    return url.toString();
  } catch {
    const sep = targetUrl.includes('?') ? '&' : '?';
    return `${targetUrl}${sep}${encodeURIComponent(paramName)}=${encodeURIComponent(affiliateId)}`;
  }
}

/**
 * Generiert einen Affiliate-Link für den angegebenen Anbieter.
 *
 * Liest die Affiliate-ID aus `affiliate_settings` (DB-Cache 5 Min.).
 * Gibt die Original-URL zurück, wenn keine ID konfiguriert oder Anbieter unbekannt.
 *
 * @param {string} provider  - Anbieter-Key ('booking', 'amazon', …)
 * @param {string} targetUrl - Basis-URL, in die die ID injiziert wird
 * @returns {Promise<string>}
 *
 * @example
 * const url = await generateAffiliateUrl('booking', 'https://www.booking.com/hotel/de/...');
 * // → 'https://www.booking.com/hotel/de/...?aid=1234567'
 *
 * @example
 * const url = await generateAffiliateUrl('amazon', 'https://www.amazon.de/dp/B0...');
 * // → 'https://www.amazon.de/dp/B0...?tag=apearound-21'
 */
export async function generateAffiliateUrl(provider, targetUrl) {
  if (!targetUrl) return targetUrl ?? '';
  try {
    const param = AFFILIATE_PARAMS[provider];
    if (!param) {
      console.warn(`[affiliate] Unbekannter Provider: "${provider}"`);
      return targetUrl;
    }

    const settings = await getCachedAffiliateSettings();
    const setting = settings[provider];

    if (!setting) {
      console.warn(`[affiliate] Kein Eintrag in affiliate_settings für Provider "${provider}". Migration ausgeführt?`);
      return targetUrl;
    }
    if (!setting.enabled) {
      return targetUrl; // deaktiviert — kein Log-Spam
    }
    if (!setting.affiliate_id) {
      console.warn(`[affiliate] affiliate_id leer für Provider "${provider}". Im Admin-Panel eintragen.`);
      return targetUrl;
    }

    return injectAffiliateParam(targetUrl, param, setting.affiliate_id);
  } catch (err) {
    // Log sichtbar — hilft bei Diagnose wenn affiliate_settings-Tabelle fehlt
    console.error(`[affiliate] generateAffiliateUrl Fehler für "${provider}":`, err);
    return targetUrl;
  }
}

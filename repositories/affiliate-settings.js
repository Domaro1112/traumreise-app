import { createServerClient } from '@/lib/supabase/server';

// Module-level 5-minute cache — avoids a DB round-trip on every affiliate click
let _cache = null;
let _cacheTime = 0;
const CACHE_TTL_MS = 5 * 60 * 1000;

/** Returns all affiliate settings as an array. */
export async function getAffiliateSettings() {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('affiliate_settings')
    .select('provider, affiliate_id, enabled')
    .order('provider');
  if (error) throw new Error(error.message);
  return data ?? [];
}

/**
 * Returns a provider → { affiliate_id, enabled } map, cached for 5 minutes.
 * Call invalidateAffiliateCache() after writes to force a fresh fetch.
 */
export async function getCachedAffiliateSettings() {
  if (_cache && Date.now() - _cacheTime < CACHE_TTL_MS) return _cache;
  const rows = await getAffiliateSettings();
  _cache = Object.fromEntries(
    rows.map(r => [r.provider, { affiliate_id: r.affiliate_id, enabled: r.enabled }])
  );
  _cacheTime = Date.now();
  return _cache;
}

/** Clears the in-memory cache (call after any write). */
export function invalidateAffiliateCache() {
  _cache = null;
  _cacheTime = 0;
}

/**
 * Upserts multiple settings at once (conflicts on provider column).
 * @param {{ provider: string, affiliate_id: string, enabled: boolean }[]} settings
 */
export async function upsertAffiliateSettings(settings) {
  const supabase = createServerClient();
  const { error } = await supabase
    .from('affiliate_settings')
    .upsert(settings, { onConflict: 'provider' });
  if (error) throw new Error(error.message);
  invalidateAffiliateCache();
}

/** Returns a single provider's setting, or null if not found. */
export async function getAffiliateSetting(provider) {
  const settings = await getCachedAffiliateSettings();
  return settings[provider] ?? null;
}

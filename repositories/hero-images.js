import { createServerClient } from '@/lib/supabase/server';
import { HERO_PAGES, defaultFocus } from '@/lib/hero-config';

// Kurzer Zwischenspeicher, damit nicht jeder Seitenaufruf die Datenbank fragt
let _cache = null;
let _cacheTime = 0;
const TTL = 60 * 1000;

async function loadAll() {
  if (_cache && Date.now() - _cacheTime < TTL) return _cache;
  const supabase = createServerClient();
  const { data, error } = await supabase.from('hero_images').select('page_key, focus_desktop, focus_mobile');
  if (error) throw new Error(error.message);
  _cache = Object.fromEntries((data ?? []).map(r => [r.page_key, { desktop: r.focus_desktop, mobile: r.focus_mobile }]));
  _cacheTime = Date.now();
  return _cache;
}

/** Fokuspunkt eines Hero-Bereichs – fällt bei Fehlern still auf die Standardwerte zurück. */
export async function getHeroFocus(key) {
  try {
    const all = await loadAll();
    return { ...defaultFocus(key), ...(all[key] ?? {}) };
  } catch {
    return defaultFocus(key);
  }
}

/** Alle Hero-Bereiche für den Admin (wirft bei fehlender Tabelle). */
export async function listHeroFocus() {
  _cache = null;
  const all = await loadAll();
  return HERO_PAGES.map(p => ({ ...p, focus: { ...defaultFocus(p.key), ...(all[p.key] ?? {}) } }));
}

export async function saveHeroFocus(key, desktop, mobile) {
  const supabase = createServerClient();
  const { error } = await supabase
    .from('hero_images')
    .upsert({ page_key: key, focus_desktop: desktop, focus_mobile: mobile, updated_at: new Date().toISOString() }, { onConflict: 'page_key' });
  if (error) throw new Error(error.message);
  _cache = null;
}

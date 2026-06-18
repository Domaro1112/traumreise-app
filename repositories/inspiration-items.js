import { createServerClient } from '@/lib/supabase/server';
import { normalizeImageUrl } from '@/lib/inspiration-items';

export async function listActiveInspirationItems() {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('inspiration_items')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function listAllInspirationItems() {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('inspiration_items')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getInspirationItem(id) {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('inspiration_items')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function createInspirationItem(body) {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('inspiration_items')
    .insert(sanitize(body))
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function updateInspirationItem(id, body) {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('inspiration_items')
    .update(sanitize(body))
    .eq('id', id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function deleteInspirationItem(id) {
  const supabase = createServerClient();
  const { error } = await supabase
    .from('inspiration_items')
    .delete()
    .eq('id', id);
  if (error) throw new Error(error.message);
}

function sanitize(body) {
  const allowed = [
    'title', 'slug', 'subtitle', 'description', 'category',
    'destination', 'country', 'region',
    'badge', 'badge_tone',
    'image_url', 'image_alt',
    'provider_key', 'affiliate_target_url', 'search_query', 'link_mode', 'open_in_new_tab',
    'price_hint', 'duration_hint', 'travel_type', 'season_hint',
    'sort_order', 'is_active', 'is_featured',
    'seo_title', 'seo_description', 'llmo_summary',
    'href', 'created_by', 'updated_by',
  ];
  const filtered = Object.fromEntries(
    Object.entries(body).filter(([k]) => allowed.includes(k))
  );
  if (typeof filtered.image_url === 'string') {
    filtered.image_url = normalizeImageUrl(filtered.image_url);
  }
  return filtered;
}

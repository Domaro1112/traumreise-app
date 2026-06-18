import { createServerClient } from '@/lib/supabase/server';
import { normalizeImageUrl } from '@/lib/homepage-suggestions';

export async function listActiveSuggestions() {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('homepage_travel_suggestions')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function listAllSuggestions() {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('homepage_travel_suggestions')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getSuggestion(id) {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('homepage_travel_suggestions')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function createSuggestion(body) {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('homepage_travel_suggestions')
    .insert(sanitize(body))
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function updateSuggestion(id, body) {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('homepage_travel_suggestions')
    .update(sanitize(body))
    .eq('id', id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function deleteSuggestion(id) {
  const supabase = createServerClient();
  const { error } = await supabase
    .from('homepage_travel_suggestions')
    .delete()
    .eq('id', id);
  if (error) throw new Error(error.message);
}

function sanitize(body) {
  const allowed = [
    'title', 'country', 'badge', 'badge_tone', 'description',
    'image_url', 'image_alt', 'href', 'sort_order', 'is_active', 'is_featured',
    'provider_key', 'affiliate_target_url', 'search_query', 'link_mode', 'open_in_new_tab',
    'created_by', 'updated_by',
  ];
  const filtered = Object.fromEntries(
    Object.entries(body).filter(([k]) => allowed.includes(k))
  );
  if (typeof filtered.image_url === 'string') {
    filtered.image_url = normalizeImageUrl(filtered.image_url);
  }
  return filtered;
}
